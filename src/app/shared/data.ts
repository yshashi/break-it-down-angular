// Mock data shared by every episode demo. No backend needed.

export type Category = 'shoes' | 'shirts' | 'bags';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
}

export interface Order {
  id: number;
  customer: string;
  total: number;
}

export const CATEGORIES: Category[] = ['shoes', 'shirts', 'bags'];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Trail Runner', category: 'shoes', price: 120 },
  { id: 2, name: 'City Sneaker', category: 'shoes', price: 95 },
  { id: 3, name: 'Leather Boot', category: 'shoes', price: 180 },
  { id: 4, name: 'Canvas Slip-on', category: 'shoes', price: 60 },
  { id: 5, name: 'Court Classic', category: 'shoes', price: 85 },
  { id: 6, name: 'Hiking Boot', category: 'shoes', price: 210 },
  { id: 7, name: 'Linen Shirt', category: 'shirts', price: 55 },
  { id: 8, name: 'Oxford Shirt', category: 'shirts', price: 70 },
  { id: 9, name: 'Denim Shirt', category: 'shirts', price: 65 },
  { id: 10, name: 'Flannel Shirt', category: 'shirts', price: 60 },
  { id: 11, name: 'Polo Shirt', category: 'shirts', price: 45 },
  { id: 12, name: 'Graphic Tee', category: 'shirts', price: 30 },
  { id: 13, name: 'Weekender Bag', category: 'bags', price: 150 },
  { id: 14, name: 'Laptop Backpack', category: 'bags', price: 110 },
  { id: 15, name: 'Canvas Tote', category: 'bags', price: 35 },
  { id: 16, name: 'Messenger Bag', category: 'bags', price: 95 },
  { id: 17, name: 'Leather Wallet', category: 'bags', price: 50 },
  { id: 18, name: 'Running Belt', category: 'bags', price: 25 },
];

const CUSTOMERS = [
  'Anna Petrova', 'Boris Ivanov', 'Chen Wei', 'Diana Georgieva', 'Emil Dimitrov',
  'Fatima Khan', 'Georgi Stoyanov', 'Hana Sato', 'Ivan Kolev', 'Julia Weber',
  'Kiran Patel', 'Lena Novak', 'Marco Rossi', 'Nina Todorova', 'Omar Haddad',
];

// 60 deterministic orders so pagination demos look the same on every take.
export const ORDERS: Order[] = Array.from({ length: 60 }, (_, i) => ({
  id: 1001 + i,
  customer: CUSTOMERS[(i * 7) % CUSTOMERS.length],
  total: 20 + ((i * 37) % 280),
}));
