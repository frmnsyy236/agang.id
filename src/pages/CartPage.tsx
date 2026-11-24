import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, ArrowRight, Plus, Minus, Trash2, Clock, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/data/menuData';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();

  // Pastikan drawer juga terbuka jika diakses langsung
  useEffect(() => {
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  return (
    <>
      <Helmet>
        <title>Keranjang Belanja - Agang.id Makassar</title>
        <meta name="description" content="Lihat menu pilihan Anda di keranjang belanja Agang.id dan selesaikan pemesanan via WhatsApp kasir resmi." />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline">
              <ArrowLeft size={16} />
              <span>Kembali ke Menu Makanan</span>
            </Link>

            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
              Keranjang Belanja ({totalItems} Menu)
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 shadow-sm space-y-5">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <ShoppingBag size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Keranjang Anda Masih Kosong</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Belum ada menu yang dipilih. Jelajahi aneka Rice Bowl nikmat, Taiwan Crispy Chicken, dan Dimsum Goreng favorit di Agang.id!
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-md"
              >
                Pilih Menu Sekarang
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-foreground truncate">{item.name}</h3>
                      <p className="text-sm font-extrabold text-red-600">{formatPrice(item.price)}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between h-20 items-end">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-600 p-1"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="font-black text-foreground text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-red-600">
                    Kosongkan Keranjang
                  </Button>
                </div>
              </div>

              {/* Order Summary & Checkout Drawer Trigger */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-4">
                  <h3 className="font-display text-lg font-bold">Ringkasan Belanja</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Jumlah Menu:</span>
                    <span>{totalItems} item</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-baseline font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-xl font-extrabold text-red-600">{formatPrice(totalPrice)}</span>
                  </div>

                  <Button
                    size="xl"
                    onClick={() => setIsCartOpen(true)}
                    className="w-full rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 py-4"
                  >
                    <span>Lanjut ke Kasir WhatsApp</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CartPage;
