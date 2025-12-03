import { CartItem, Order } from "../types/product";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost/university-apparel-api";

type ProductPayload = {
  legacy_id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  department: string;
  image_url?: string;
  in_stock?: boolean;
  stock_count?: number;
  sizes?: string[];
};

const jsonHeaders = {
  "Content-Type": "application/json",
};

const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const text = await response.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          message = json.error || json.message || text;
        } catch {
          message = text;
        }
      }
    } catch (e) {
      message = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
};

export const api = {
  async getProducts() {
    return handleResponse<Product[]>(await fetch(`${API_BASE}/products.php`));
  },

  async addProduct(product: ProductPayload) {
    return handleResponse<any>(
      await fetch(`${API_BASE}/products.php`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(product),
      })
    );
  },

  async updateProduct(productId: number, updates: Partial<ProductPayload>) {
    await handleResponse(
      await fetch(`${API_BASE}/products.php?id=${productId}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(updates),
      })
    );
  },

  async deleteProduct(productId: number) {
    await handleResponse(
      await fetch(`${API_BASE}/products.php?id=${productId}`, {
        method: "DELETE",
      })
    );
  },

  async getOrders(email?: string) {
    const url = new URL(`${API_BASE}/orders.php`);
    if (email) {
      url.searchParams.set("email", email);
    }
    return handleResponse<Order[]>(await fetch(url));
  },

  async createOrder(order: Order, items: CartItem[]) {
    return handleResponse<Order>(
      await fetch(`${API_BASE}/orders.php`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          studentName: order.studentName,
          studentId: order.studentId,
          email: order.email,
          phone: order.phone,
          department: order.department,
          courseYear: order.courseYear,
          deliveryMethod: order.deliveryMethod,
          totalAmount: order.totalAmount,
          status: order.status,
          classRepresentative: order.classRepresentative,
          items: items.map((item) => {
            const productId = Number(item.product.id);
            if (Number.isNaN(productId)) {
              throw new Error("Invalid product id");
            }
            return {
              productId,
              size: item.size,
              quantity: item.quantity,
              unitPrice: item.product.price,
            };
          }),
        }),
      })
    );
  },

  async updateOrderStatus(orderId: number, status: Order["status"]) {
    await handleResponse(
      await fetch(`${API_BASE}/orders.php?id=${orderId}`, {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify({ status }),
      })
    );
  },

  async adminLogin(email: string, password: string) {
    return handleResponse<{ id: number; email: string }>(
      await fetch(`${API_BASE}/admin-login.php`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email, password }),
      })
    );
  },
};

