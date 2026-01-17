import menuRicebowlTokyo from '@/assets/chicken tokyo.jpg';
import menuRicebowlCheese from '@/assets/chicken chesee.jpg';
import menuRicebowlOriginal from '@/assets/chicken original.jpg';
import menuRicebowlKatsu from '@/assets/chicken original.jpg';

import menuTaiwanCheese from '@/assets/chicken tokyo.jpg';
import menuTaiwanBalado from '@/assets/chicken chesee.jpg';
import menuTaiwanBBQ from '@/assets/chicken tokyo.jpg';

import menuDimsumOriginal from '@/assets/dimsum original .jpg';
import menuDimsumMentaiCheese from '@/assets/dimsummentaichesee.jpg';
import menuDimsumMentai from '@/assets/dimsummentai.jpg';
// import menuMushroom from '@/assets/dimsum original .jpg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'ricebowl' | 'taiwan' | 'dimsum';
  isPopular?: boolean;
  isNew?: boolean;
}

export const menuItems: MenuItem[] = [
  // === Rice Bowl ===
  {
    id: 'rb-1',
    name: 'Chicken Tokyo',
    description:
      'Ayam juicy dengan saus teriyaki manis-gurih khas Jepang, dipadukan nasi hangat yang bikin nagih.',
    price: 18500,
    image: menuRicebowlTokyo,
    category: 'ricebowl',
    isPopular: true,
  },
  {
    id: 'rb-2',
    name: 'Chicken Original',
    description:
      'Ayam gurih dengan sambal matah segar pedas-aromatik, pedasnya nendang dan bikin ketagihan.',
    price: 17000,
    image: menuRicebowlOriginal,
    category: 'ricebowl',
  },
  {
    id: 'rb-3',
    name: 'Chicken Cheese',
    description:
      'Ayam crispy disiram saus keju creamy dan gurih, sekali suap langsung bikin mood naik.',
    price: 18500,
    image: menuRicebowlCheese,
    category: 'ricebowl',
    isNew: true,
  },
  {
    id: 'rb-4',
    name: 'Spicy Chicken Katsu',
    description:
      'Ayam katsu crispy renyah di luar, lembut di dalam, disajikan dengan saus gurih yang mantap.',
    price: 18500,
    image: menuRicebowlKatsu,
    category: 'ricebowl',
  },

  // === Taiwan Chicken ===
  {
    id: 'tw-1',
    name: 'Taiwan Chicken Cheese',
    description:
      'Ayam goreng renyah dengan saus keju leleh creamy, perpaduan gurih yang susah ditolak.',
    price: 17000,
    image: menuTaiwanCheese,
    category: 'taiwan',
    isPopular: true,
  },
  {
    id: 'tw-2',
    name: 'Taiwan Chicken Balado',
    description:
      'Ayam crispy dibalut sambal balado pedas-merah yang menggugah selera.',
    price: 17000,
    image: menuTaiwanBalado,
    category: 'taiwan',
  },
  {
    id: 'tw-3',
    name: 'Taiwan Chicken BBQ',
    description:
      'Ayam goreng khas Taiwan dengan saus BBQ manis-smokey.',
    price: 17000,
    image: menuTaiwanBBQ,
    category: 'taiwan',
  },

  // === Dimsum ===
  {
    id: 'ds-1',
    name: 'Dimsum Original',
    description:
      'Dimsum lembut dengan cita rasa gurih klasik.',
    price: 18000,
    image: menuDimsumOriginal,
    category: 'dimsum',
  },
  {
    id: 'ds-2',
    name: 'Dimsum Mentai Cheese',
    description:
      'Dimsum lembut dengan saus mentai keju creamy maksimal.',
    price: 28000,
    image: menuDimsumMentaiCheese,
    category: 'dimsum',
    isPopular: true,
  },
  {
    id: 'ds-3',
    name: 'Dimsum Mentai',
    description:
      'Dimsum ayam disiram saus mentai gurih-manis.',
    price: 23000,
    image: menuDimsumMentai,
    category: 'dimsum',
  },
  // {
  //   id: 'ds-4',
  //   name: 'Mushroom Original',
  //   description:
  //     'Jamur crispy gurih dengan tekstur renyah di luar dan juicy di dalam.',
  //   price: 18000,
  //   image: menuMushroom,
  //   category: 'dimsum',
  //   isNew: true,
  // },
];

export const categories = [
  { id: 'ricebowl', name: 'Rice Bowl', icon: '🍚' },
  { id: 'taiwan', name: 'Taiwan', icon: '🥟' },
  { id: 'dimsum', name: 'Dimsum', icon: '🥢' },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
