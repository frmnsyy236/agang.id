import menuRicebowlTokyo from '@/assets/chicken tokyo.jpg';
import menuRicebowlCheese from '@/assets/chicken chesee.jpg';
import menuRicebowlOriginal from '@/assets/chicken original.jpg';
import menuRicebowlKatsu from '@/assets/Ciken katsu.jpg';

import menuTaiwanCheese from '@/assets/Taiwan Chesee.jpg';
import menuTaiwanBalado from '@/assets/Taiwan Balado.jpg';
import menuTaiwanBBQ from '@/assets/Taiwan BBQ.jpg';

import menuDimsumOriginal from '@/assets/dimsum original .jpg';
import menuDimsumMentaiCheese from '@/assets/dimsummentaichesee.jpg';
import menuDimsumMentai from '@/assets/dimsummentai.jpg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay?: string;
  image: string;
  category: 'ricebowl' | 'taiwan' | 'dimsum';
  isPopular?: boolean;
  isNew?: boolean;
}

export const menuItems: MenuItem[] = [
  // === 5 Menu Flagship Kuliner Makassar Agang.id ===
  {
    id: 'rb-matah',
    name: 'Rice Bowl Sambel Matah',
    description: 'Potongan dada ayam krispi hangat dengan racikan sambal matah segar khas Makassar.',
    price: 12000,
    priceDisplay: 'Rp12.000 - Rp15.000',
    image: menuRicebowlOriginal,
    category: 'ricebowl',
    isPopular: true,
  },
  {
    id: 'rb-cheese',
    name: 'Rice Bowl Cheese',
    description: 'Ayam krispi dengan siraman saus keju creamy gurih di atas nasi pulen.',
    price: 15000,
    priceDisplay: 'Rp15.000 - Rp18.000',
    image: menuRicebowlCheese,
    category: 'ricebowl',
    isPopular: true,
  },
  {
    id: 'tw-taiwan',
    name: 'Taiwan Chicken',
    description: 'Ayam goreng renyah ala Taiwan dengan pilihan bumbu Cheese, Barbeque, Jagung Bakar, dan Balado.',
    price: 10000,
    priceDisplay: 'Rp10.000 - Rp15.000',
    image: menuTaiwanCheese,
    category: 'taiwan',
    isPopular: true,
  },
  {
    id: 'tw-kulit',
    name: 'Kulit Crispy',
    description: 'Kulit ayam goreng renyah berbumbu gurih untuk camilan malam di Makassar.',
    price: 10000,
    priceDisplay: 'Rp10.000 - Rp15.000',
    image: menuRicebowlKatsu,
    category: 'taiwan',
    isPopular: true,
  },
  {
    id: 'ds-goreng',
    name: 'Dimsum Goreng',
    description: 'Dimsum goreng renyah di luar dengan isian keju lumer di dalam.',
    price: 5000,
    priceDisplay: 'Rp5.000 / satuan, Rp15.000 / porsi',
    image: menuDimsumOriginal,
    category: 'dimsum',
    isPopular: true,
  },

  // === Menu Favorit Lainnya ===
  {
    id: 'rb-tokyo',
    name: 'Chicken Tokyo Rice Bowl',
    description: 'Ayam juicy dengan saus teriyaki manis-gurih khas Jepang, dipadukan nasi hangat yang bikin nagih.',
    price: 18500,
    priceDisplay: 'Rp18.500',
    image: menuRicebowlTokyo,
    category: 'ricebowl',
  },
  {
    id: 'tw-balado',
    name: 'Taiwan Chicken Balado',
    description: 'Ayam crispy dibalut racikan bumbu balado pedas manis yang menggugah selera.',
    price: 17000,
    priceDisplay: 'Rp17.000',
    image: menuTaiwanBalado,
    category: 'taiwan',
  },
  {
    id: 'tw-bbq',
    name: 'Taiwan Chicken BBQ',
    description: 'Ayam goreng khas Taiwan dengan taburan bumbu BBQ smokey manis gurih.',
    price: 17000,
    priceDisplay: 'Rp17.000',
    image: menuTaiwanBBQ,
    category: 'taiwan',
  },
  {
    id: 'ds-mentaicheese',
    name: 'Dimsum Mentai Cheese',
    description: 'Dimsum lembut dengan saus mentai keju creamy lumer maksimal khas Makassar.',
    price: 28000,
    priceDisplay: 'Rp28.000',
    image: menuDimsumMentaiCheese,
    category: 'dimsum',
  },
  {
    id: 'ds-mentai',
    name: 'Dimsum Mentai',
    description: 'Dimsum ayam lezat disiram saus mentai gurih-manis yang dipanggang wangi.',
    price: 23000,
    priceDisplay: 'Rp23.000',
    image: menuDimsumMentai,
    category: 'dimsum',
  },
];

export const categories = [
  {
    id: 'ricebowl',
    name: 'Rice Bowl Makassar',
    icon: '🍚',
    description: 'Rice Bowl ayam krispi sambel matah & keju creamy hangat porsi kenyang.',
  },
  {
    id: 'taiwan',
    name: 'Taiwan Chicken & Camilan',
    icon: '🍗',
    description: 'Ayam goreng renyah khas Taiwan & kulit crispy gurih camilan malam Makassar.',
  },
  {
    id: 'dimsum',
    name: 'Dimsum Goreng & Mentai',
    icon: '🥟',
    description: 'Dimsum goreng keju lumer & aneka dimsum mentai spesial Makassar.',
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
