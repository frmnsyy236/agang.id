import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, MenuItemInput } from '@/types/menu';
import { initialMenuItems } from '@/data/menuData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MenuContextType {
  menuItems: MenuItem[];
  isCloudConnected: boolean;
  isLoading: boolean;
  addMenuItem: (data: MenuItemInput) => Promise<MenuItem>;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => Promise<void>;
  updatePrice: (id: string, newPrice: number, priceDisplay?: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  moveMenuItem: (id: string, direction: 'up' | 'down') => Promise<void>;
  reorderMenuItems: (items: MenuItem[]) => Promise<void>;
  resetMenuToDefault: () => void;
  refreshFromCloud: () => Promise<void>;
}

const STORAGE_KEY = 'agang_menus_v1';

const mapFromSupabase = (row: any): MenuItem => ({
  id: String(row.id),
  name: row.name || '',
  description: row.description || '',
  price: Number(row.price) || 0,
  priceDisplay: row.price_display || row.priceDisplay || undefined,
  image: row.image || '',
  category: row.category || 'ricebowl',
  isPopular: Boolean(row.is_popular ?? row.isPopular),
  isNew: Boolean(row.is_new ?? row.isNew),
  order: typeof row.display_order === 'number' ? row.display_order : (row.order ?? 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapToSupabase = (item: Partial<MenuItem>) => {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.name !== undefined) row.name = item.name;
  if (item.description !== undefined) row.description = item.description;
  if (item.price !== undefined) row.price = item.price;
  if (item.priceDisplay !== undefined) row.price_display = item.priceDisplay;
  if (item.image !== undefined) row.image = item.image;
  if (item.category !== undefined) row.category = item.category;
  if (item.isPopular !== undefined) row.is_popular = item.isPopular;
  if (item.isNew !== undefined) row.is_new = item.isNew;
  if (item.order !== undefined) row.display_order = item.order;
  row.updated_at = new Date().toISOString();
  return row;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      }
    } catch (e) {
      console.error('Failed to parse menu items from localStorage', e);
    }
    return initialMenuItems;
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state to localStorage whenever menuItems change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Failed to save menu items to localStorage', e);
    }
  }, [menuItems]);

  // Fetch from Supabase
  const refreshFromCloud = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        // Table might not exist yet
        setIsCloudConnected(false);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapFromSupabase).sort((a, b) => a.order - b.order);
        setMenuItems(mapped);
        setIsCloudConnected(true);
      } else if (data && data.length === 0) {
        // Table exists but empty, seed default items to cloud
        setIsCloudConnected(true);
        const seedRows = initialMenuItems.map((item, idx) => ({
          ...mapToSupabase(item),
          id: item.id,
          display_order: idx,
          created_at: new Date().toISOString(),
        }));
        await supabase.from('menu_items').upsert(seedRows);
      }
    } catch (err) {
      console.warn('Could not sync menus from Supabase:', err);
      setIsCloudConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial cloud sync and realtime subscription
  useEffect(() => {
    refreshFromCloud();

    const channel = supabase
      .channel('menu_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          refreshFromCloud();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromCloud]);

  // Add new menu item
  const addMenuItem = async (data: MenuItemInput): Promise<MenuItem> => {
    const nextOrder = menuItems.length > 0 ? Math.max(...menuItems.map((m) => m.order ?? 0)) + 1 : 0;
    const newItem: MenuItem = {
      id: `menu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price) || 0,
      priceDisplay: data.priceDisplay?.trim() || undefined,
      image: data.image.trim(),
      category: data.category || 'ricebowl',
      isPopular: Boolean(data.isPopular),
      isNew: data.isNew !== undefined ? Boolean(data.isNew) : true,
      order: data.order !== undefined ? data.order : nextOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMenuItems((prev) => {
      const updated = [...prev, newItem].sort((a, b) => a.order - b.order);
      return updated;
    });

    try {
      const row = {
        ...mapToSupabase(newItem),
        id: newItem.id,
        created_at: newItem.createdAt,
      };
      const { error } = await supabase.from('menu_items').insert([row]);
      if (error) {
        console.warn('Supabase menu insert warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase offline or table missing:', e);
    }

    toast.success(`Menu "${newItem.name}" berhasil diposting!`);
    return newItem;
  };

  // Update existing menu item
  const updateMenuItem = async (id: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...updated,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        })
        .sort((a, b) => a.order - b.order)
    );

    try {
      const row = mapToSupabase(updated);
      await supabase.from('menu_items').update(row).eq('id', id);
    } catch (e) {
      console.warn('Supabase update warning:', e);
    }

    toast.success('Data menu berhasil diperbarui!');
  };

  // Quick price update
  const updatePrice = async (id: string, newPrice: number, priceDisplay?: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            price: newPrice,
            priceDisplay: priceDisplay !== undefined ? priceDisplay : item.priceDisplay,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    try {
      const payload: Record<string, any> = {
        price: newPrice,
        updated_at: new Date().toISOString(),
      };
      if (priceDisplay !== undefined) {
        payload.price_display = priceDisplay;
      }
      await supabase.from('menu_items').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase price update warning:', e);
    }

    toast.success('Harga menu berhasil diubah!');
  };

  // Delete menu item
  const deleteMenuItem = async (id: string) => {
    const itemToDelete = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await supabase.from('menu_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete warning:', e);
    }

    toast.success(`Menu "${itemToDelete?.name || ''}" telah dihapus.`);
  };

  // Move item up or down
  const moveMenuItem = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...menuItems].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item.id === id);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = sorted[index];
    const targetItem = sorted[targetIndex];

    // Swap orders
    const currentOrder = currentItem.order;
    const targetOrder = targetItem.order;

    currentItem.order = targetOrder === currentOrder ? (direction === 'up' ? currentOrder - 1 : currentOrder + 1) : targetOrder;
    targetItem.order = currentOrder;

    // Normalize all orders 0, 1, 2, ...
    sorted.sort((a, b) => a.order - b.order);
    const reindexed = sorted.map((item, idx) => ({ ...item, order: idx }));

    setMenuItems(reindexed);

    // Persist to Supabase
    try {
      const updates = reindexed.map((item) => ({
        id: item.id,
        display_order: item.order,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('menu_items').upsert(updates);
    } catch (e) {
      console.warn('Supabase reorder sync warning:', e);
    }

    toast.success(`Posisi menu "${currentItem.name}" berhasil diubah!`);
  };

  // Reorder whole array
  const reorderMenuItems = async (items: MenuItem[]) => {
    const reindexed = items.map((item, idx) => ({ ...item, order: idx }));
    setMenuItems(reindexed);

    try {
      const updates = reindexed.map((item) => ({
        id: item.id,
        display_order: item.order,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('menu_items').upsert(updates);
    } catch (e) {
      console.warn('Supabase reorder sync warning:', e);
    }

    toast.success('Urutan posisi menu berhasil disimpan!');
  };

  // Reset to initial default items
  const resetMenuToDefault = async () => {
    const defaults = initialMenuItems.map((item, idx) => ({ ...item, order: idx }));
    setMenuItems(defaults);

    try {
      const rows = defaults.map((item) => ({
        ...mapToSupabase(item),
        id: item.id,
        created_at: new Date().toISOString(),
      }));
      await supabase.from('menu_items').upsert(rows);
    } catch (e) {
      console.warn('Supabase reset warning:', e);
    }

    toast.success('Daftar menu berhasil dikembalikan ke standar awal.');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isCloudConnected,
        isLoading,
        addMenuItem,
        updateMenuItem,
        updatePrice,
        deleteMenuItem,
        moveMenuItem,
        reorderMenuItems,
        resetMenuToDefault,
        refreshFromCloud,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
