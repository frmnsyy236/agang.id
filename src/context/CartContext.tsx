import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderCustomerData, OrderRecord } from '@/types/cart';
import { MenuItem } from '@/types/menu';
import { formatPrice } from '@/data/menuData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface OrderSubmitResult {
  success: boolean;
  waUrl: string;
  orderId: string;
}

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
  submitOrder: (customer: OrderCustomerData, customOrderId?: string) => Promise<OrderSubmitResult | null>;
  sendQuickOrderToWhatsApp: (notes?: string, customOrderId?: string) => OrderSubmitResult | null;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const CART_STORAGE_KEY = 'agang_cart_items_v1';
const ORDERS_STORAGE_KEY = 'agang_orders_history_v1';
export const WHATSAPP_NUMBER = '6281919491455';

// Direct WhatsApp API URL builder
export const buildWhatsAppUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;
};

// Formats full checkout message
export const buildWhatsAppMessage = (
  orderId: string,
  customer: OrderCustomerData,
  items: CartItem[],
  totalPrice: number,
  shippingFee: number,
  grandTotal: number
): string => {
  const deliveryText =
    customer.deliveryType === 'delivery'
      ? 'Diantar ke Alamat (Delivery)'
      : 'Ambil Sendiri di Outlet (Pickup)';

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
  items.forEach((item) => {
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
    message += `📏 *Jarak / Radius:* ${customer.deliveryZone || 'Radius ≤ 3 km (Rp7.000)'}\n`;
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

  return message;
};

// Formats quick checkout message
export const buildQuickWhatsAppMessage = (
  orderId: string,
  items: CartItem[],
  totalPrice: number,
  notes?: string
): string => {
  let itemsList = '';
  items.forEach((item) => {
    const subtotal = formatPrice(item.price * item.quantity);
    itemsList += `• ${item.quantity}x ${item.name} (${subtotal})\n`;
    if (item.notes) {
      itemsList += `   _Catatan: ${item.notes}_\n`;
    }
  });

  let message = `*PESANAN BARU - AGANG.ID* 🍽️\n`;
  message += `No. Pesanan: *#${orderId}*\n`;
  message += `-----------------------------------------\n`;
  message += `*RINCIAN MENU:*\n${itemsList}`;
  message += `-----------------------------------------\n`;
  message += `💰 *Subtotal Menu:* *${formatPrice(totalPrice)}*\n`;
  if (notes) {
    message += `📝 *Catatan:* ${notes}\n`;
  }
  message += `-----------------------------------------\n`;
  message += `Halo kasir Agang.id! Saya ingin pesan menu di atas via website. Mohon info ongkir dan konfirmasi ketersediaannya ya. Terima kasih! 🙏`;

  return message;
};

// Direct redirection: NEVER blocked by popup blockers!
export const redirectToWhatsApp = (waUrl: string) => {
  if (typeof window === 'undefined') return;
  // Direct location navigation works universally on Android, iOS, Windows, Mac
  window.location.href = waUrl;
};

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

  // Totals calculation
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add item to cart
  const addToCart = (item: MenuItem, qty = 1, notes?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qty,
          notes: notes !== undefined ? notes : next[existingIndex].notes,
        };
        return next;
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

    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      description: 'Klik ikon keranjang di atas untuk melanjutkan pemesanan via WhatsApp.',
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

  // Submit full order & send to WhatsApp
  const submitOrder = async (
    customer: OrderCustomerData,
    customOrderId?: string
  ): Promise<OrderSubmitResult | null> => {
    if (items.length === 0) {
      toast.error('Keranjang belanja Anda masih kosong.');
      return null;
    }

    const orderId = customOrderId || `AG-${Date.now().toString().slice(-6)}`;
    const shippingFee =
      customer.deliveryType === 'delivery'
        ? customer.shippingFee !== undefined
          ? customer.shippingFee
          : 7000
        : 0;
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

    // Save to local state
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Supabase (in background)
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

    const message = buildWhatsAppMessage(
      orderId,
      customer,
      items,
      totalPrice,
      shippingFee,
      grandTotal
    );
    const waUrl = buildWhatsAppUrl(message);

    // Clear cart
    clearCart();

    // Trigger instant unblockable redirect
    redirectToWhatsApp(waUrl);

    return {
      success: true,
      waUrl,
      orderId,
    };
  };

  // Quick order straight to WhatsApp without filling the full form
  const sendQuickOrderToWhatsApp = (
    quickNotes?: string,
    customOrderId?: string
  ): OrderSubmitResult | null => {
    if (items.length === 0) {
      toast.error('Keranjang belanja Anda masih kosong.');
      return null;
    }

    const orderId = customOrderId || `AG-${Date.now().toString().slice(-6)}`;
    const message = buildQuickWhatsAppMessage(orderId, items, totalPrice, quickNotes);
    const waUrl = buildWhatsAppUrl(message);

    clearCart();
    redirectToWhatsApp(waUrl);

    return {
      success: true,
      waUrl,
      orderId,
    };
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
        sendQuickOrderToWhatsApp,
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
