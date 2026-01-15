import menuRicebowl from '@/assets/menu-ricebowl.jpg';
import menuTaiwan from '@/assets/menu-taiwan.jpg';
import menuDimsum from '@/assets/menu-dimsum.jpg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'ricebowl' | 'taiwan' | 'dimsum';
}

export const menuItems: MenuItem[] = [
  // === Rice Bowl (4) ===
  {
    id: 'rb-1',
    name: 'Chicken Tokyo',
    description: 'Ayam juicy dengan saus teriyaki manis-gurih khas Jepang, dipadukan nasi hangat yang bikin nagih.',
    price: 17000,
    image: menuRicebowl,
    category: 'ricebowl',
  },
  {
    id: 'rb-2',
    name: 'Chicken Original',
    description: 'Ayam gurih dengan sambal matah segar pedas-aromatik, pedasnya nendang dan bikin ketagihan.',
    price: 17000,
    image: menuRicebowl,
    category: 'ricebowl',
  },
  {
    id: 'rb-3',
    name: 'Chicken Cheese',
    description: 'Ayam crispy disiram saus keju creamy dan gurih, sekali suap langsung bikin mood naik.',
    price: 18000,
    image: menuRicebowl,
    category: 'ricebowl',
  },
  {
    id: 'rb-4',
    name: 'Spicy Chicken Katsu',
    description: 'Ayam katsu crispy renyah di luar, lembut di dalam, disajikan dengan saus gurih yang mantap.',
    price: 18000,
    image: menuRicebowl,
    category: 'ricebowl',
  },

  // === Taiwan Chicken (3) ===
  {
    id: 'tw-1',
    name: 'Taiwan Chicken Chesee',
    description: 'Ayam goreng renyah dengan saus keju leleh creamy, perpaduan gurih yang susah ditolak.',
    price: 15000,
    image: menuTaiwan,
    category: 'taiwan',
  },
  {
    id: 'tw-2',
    name: 'Taiwan Chicken Balado',
    description: 'Ayam crispy dibalut sambal balado pedas-merah yang menggugah selera, pedasnya mantap!',
    price: 15000,
    image: menuTaiwan,
    category: 'taiwan',
  },
  {
    id: 'tw-3',
    name: 'Taiwan Chicken BBQ',
    description: 'Ayam goreng khas Taiwan dengan saus BBQ manis-smokey, aromanya menggoda dari gigitan pertama.',
    price: 15000,
    image: menuTaiwan,
    category: 'taiwan',
  },

  // === Dimsum (3) ===
  {
    id: 'ds-1',
    name: 'Dimsum Original',
    description: 'Dimsum lembut dengan saus mentai keju lumer, creamy maksimal di setiap gigitan.',
    price: 18000,
    image: menuDimsum,
    category: 'dimsum',
  },
  {
    id: 'ds-2',
    name: 'Dimsum Mentai Chesee',
    description: 'Dimsum lembut dengan saus mentai keju lumer, creamy maksimal di setiap gigitan.',
    price: 28000,
    image: menuDimsum,
    category: 'dimsum',
  },
  {
    id: 'ds-3',
    name: 'Dimsum Mentai',
    description: 'Dimsum ayam disiram saus mentai creamy dengan rasa gurih-manis yang bikin nagih.',
    price: 23000,
    image: menuDimsum,
    category: 'dimsum',
  },
];

export const categories = [
  { id: 'ricebowl', name: 'Rice Bowl', icon: '🍚' },
  { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
  { id: 'dimsum', name: 'Dimsum', icon: '🥟' },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
