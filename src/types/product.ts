export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  department: string;
  image: string;
  sizes: string[];
  inStock: boolean;
  stockCount: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export type DeliveryMethod = "department-pickup" | "class-representative";

export interface Order {
  id: string;
  orderNumber: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  courseYear: string;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  classRepresentative?: {
    name: string;
    studentId: string;
    phone: string;
  };
  totalAmount: number;
  status: "pending" | "confirmed" | "ready-for-pickup" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}