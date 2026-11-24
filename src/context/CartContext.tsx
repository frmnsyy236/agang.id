import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderCustomerData, OrderRecord } from '@/types/cart';
import { MenuItem } from '@/types/menu';
import { formatPrice } from '@/data/menuData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, qty?: number, notes?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orders: OrderRecord[];
  submitOrder: (customer: OrderCustomerData) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const CART_STORAGE_KEY = 'agang_cart_items_v1';
const ORDERS_STORAGE_KEY = 'agang_orders_history_v1';
const WHATSAPP_NUMBER = '6281919491455';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart items state
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Orders history state
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse orders from localStorage', e);
    }
    return [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Load orders from Supabase on mount
  useEffect(() => {
    const fetchCloudOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: OrderRecord[] = data.map((row: any) => ({
            id: row.id,
            customer: row.customer_data || row.customer,
            items: row.items || [],
            totalAmount: Number(row.total_amount) || 0,
            status: row.status || 'pending',
            createdAt: row.created_at,
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn('Could not sync orders from Supabase:', err);
      }
    };

    fetchCloudOrders();
  }, []);

  // Compute totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add item to cart
  const addToCart = (item: MenuItem, qty = 1, notes?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += qty;
        if (notes) copy[existingIndex].notes = notes;
        return copy;
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: qty,
          notes,
        },
      ];
    });

    toast.success(`"${item.name}" dimasukkan ke keranjang!`, {
      description: 'Klik ikon keranjang untuk melihat atau checkout pesanan.',
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info('Item dihapus dari keranjang.');
  };

  // Clear all items in cart
  const clearCart = () => {
    setItems([]);
  };

  // Submit order & send to WhatsApp
  const submitOrder = async (customer: OrderCustomerData): Promise<boolean> => {
    if (items.length === 0) {
      toast.error('Keranjang belanja Anda masih kosong.');
      return false;
    }

    const shippingFee = customer.deliveryType === 'delivery' ? (customer.shippingFee !== undefined ? customer.shippingFee : 7000) : 0;
    const grandTotal = totalPrice + shippingFee;

    const newOrder: OrderRecord = {
      id: orderId,
      customer: {
        ...customer,
        shippingFee,
      },
      items: [...items],
      totalAmount: grandTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Construct formatted WhatsApp message
    const deliveryText =
      customer.deliveryType === 'delivery'
        ? `Diantar ke Alamat (Delivery)`
        : `Ambil Sendiri di Outlet (Pickup)`;

    const outletName =
      customer.outlet === 'inpres_maccini'
        ? 'Area SD Inpres Maccini, Makassar'
        : 'Jl. Pongtiku (Depan Bimbel JILC), Makassar';

    const paymentLabel =
      customer.paymentMethod === 'qris'
        ? 'QRIS (Semua E-Wallet/Mobile Banking)'
        : customer.paymentMethod === 'transfer'
        ? 'Transfer Bank'
        : 'Tunai / Bayar di Tempat (COD)';

    let itemsList = '';
    items.forEach((item, idx) => {
      const subtotal = formatPrice(item.price * item.quantity);
      itemsList += `• ${item.quantity}x ${item.name} (${subtotal})\n`;
      if (item.notes) {
        itemsList += `   _Catatan: ${item.notes}_\n`;
      }
    });

    let message = `*PESANAN BARU - AGANG.ID* 🍽️\n`;
    message += `No. Pesanan: *#${orderId}*\n`;
    message += `-----------------------------------------\n`;
    message += `👤 *Nama Pemesan:* ${customer.name}\n`;
    message += `📱 *No. WhatsApp:* ${customer.phone}\n`;
    message += `🛵 *Metode Layanan:* ${deliveryText}\n`;
    if (customer.deliveryType === 'delivery') {
      message += `📍 *Alamat Pengiriman:* ${customer.address}\n`;
      if (customer.landmark) {
        message += `🏢 *Patokan Lokasi:* ${customer.landmark}\n`;
      }
      message += `📏 *Jarak / Radius:* ${customer.deliveryZone || 'Radius <= 3 km (Rp7.000)'}\n`;
    }
    message += `🏬 *Pilihan Outlet:* ${outletName}\n`;
    message += `💳 *Metode Pembayaran:* ${paymentLabel}\n`;
    if (customer.notes) {
      message += `📝 *Catatan Khusus:* ${customer.notes}\n`;
    }
    message += `-----------------------------------------\n`;
    message += `*RINCIAN MENU:*\n${itemsList}`;
    message += `-----------------------------------------\n`;
    message += `Subtotal Menu: ${formatPrice(totalPrice)}\n`;
    if (customer.deliveryType === 'delivery') {
      message += `🛵 Ongkos Kirim: ${formatPrice(shippingFee)}\n`;
    }
    message += `💰 *TOTAL KESELURUHAN:* *${formatPrice(grandTotal)}*\n`;
    message += `-----------------------------------------\n`;
    message += `Halo kasir Agang.id! Mohon diproses dan konfirmasi pesanan saya ya. Terima kasih! 🙏`;

    // Save to local state
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Supabase (in background so it doesn't delay or block opening WhatsApp)
    supabase
      .from('orders')
      .insert([
        {
          id: newOrder.id,
          customer_data: newOrder.customer,
          items: newOrder.items,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          created_at: newOrder.createdAt,
        },
      ])
      .then(() => {})
      .catch((e) => console.warn('Supabase offline or orders table missing:', e));

    // Open WhatsApp (Reliable for both mobile and desktop)
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    // Clean up cart before redirection
    clearCart();
    setIsCartOpen(false);

    toast.success('Membuka WhatsApp Business Agang.id...', {
      description: `Nomor pesanan: #${orderId}. Mohon tekan tombol KIRIM di WhatsApp.`,
      duration: 5000,
    });

    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      window.open(waUrl, '_blank');
    }

    return true;
  };

  // Update order status (for admin)
  const updateOrderStatus = async (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );

    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {
      console.warn('Supabase order update warning:', e);
    }

    toast.success(`Status pesanan #${orderId} diubah menjadi "${status}".`);
  };

  // Delete order (for admin)
  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));

    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.warn('Supabase order delete warning:', e);
    }

    toast.success(`Pesanan #${orderId} telah dihapus.`);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        orders,
        submitOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
