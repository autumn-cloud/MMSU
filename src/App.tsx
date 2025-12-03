import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import Shop from "./components/Shop";
import ContactPage from "./components/ContactPage";
import ReservationForm from "./components/ReservationForm";
import OrderStatus from "./components/OrderStatus";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminProducts from "./components/AdminProducts";
import UserProfile, { UserProfileData } from "./components/UserProfile";
import { CartItem, Product, Order } from "./types/product";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { api } from "./lib/api";
import { products as fallbackProducts } from "./data/products";
import { resolveProductImage } from "./data/productAssets";

const mapApiProduct = (p: any): Product => {
  if (!p) {
    return {
      id: crypto.randomUUID(),
      name: "Unknown Product",
      description: "",
      price: 0,
      category: "N/A",
      department: "N/A",
      image: "",
      sizes: [],
      inStock: true,
      stockCount: 0,
    };
  }

  return {
    id: String(p.id ?? p.legacy_id ?? crypto.randomUUID()),
    name: p.name ?? "Unnamed Product",
    description: p.description ?? "",
    price: Number(p.price ?? p.unitPrice ?? 0),
    category: p.category ?? "",
    department: p.department ?? "",
    image: resolveProductImage(p.image_url ?? p.image),
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    inStock: Boolean(p.in_stock ?? p.inStock ?? true),
    stockCount: Number(p.stock_count ?? p.stockCount ?? 0),
  };
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    fullName: "",
    studentId: "",
    phone: "",
    department: "",
    courseYear: "",
  });

  // Load orders from localStorage so admin can review across sessions
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setProductsState(data.map(mapApiProduct));
      } catch (error) {
        console.error("Failed to load products from API", error);
        setApiError("Unable to reach the API. Showing bundled catalog instead.");
        setProductsState(fallbackProducts);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const refreshOrders = async (email?: string) => {
    setOrdersLoading(true);
    try {
      const data = await api.getOrders(email);
      const mapped = data.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt ?? order.created_at ?? new Date()),
        updatedAt: new Date(order.updatedAt ?? order.updated_at ?? new Date()),
        items: (order.items ?? []).map((item: any) => ({
          product: mapApiProduct(item.product),
          size: item.size,
          quantity: item.quantity,
        })),
      }));
      setOrders(mapped);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Unable to load orders from the server");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogin = (email: string, password: string) => {
    // Simple validation for demo purposes
    if (email.includes("@mmsu.edu.ph") || email.includes("@")) {
      setIsAuthenticated(true);
      setUserEmail(email);
      toast.success(`Welcome back, ${email.split("@")[0]}!`);
      setCurrentView("shop");
      refreshOrders(email);
    } else {
      toast.error("Please use a valid email address");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setCartItems([]);
    setCurrentView("home");
    setUserProfile({
      fullName: "",
      studentId: "",
      phone: "",
      department: "",
      courseYear: "",
    });
    toast.info("You have been logged out");
  };

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { product, size, quantity }]);
    }
    
    toast.success(`${product.name} (Size ${size}) added to cart!`);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    toast.info("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setCurrentView("reservation");
  };

  const handleSubmitOrder = async (order: Order) => {
    try {
      const saved = await api.createOrder(order, cartItems);
      const normalized: Order = {
        ...order,
        id: saved.id ?? order.id,
        orderNumber: saved.orderNumber ?? order.orderNumber,
        createdAt: new Date(saved.createdAt ?? new Date()),
        updatedAt: new Date(saved.updatedAt ?? new Date()),
        items: (saved.items ?? []).map((item: any) => ({
          product: mapApiProduct(item.product),
          size: item.size,
          quantity: item.quantity,
        })),
      };
      setOrders([normalized, ...orders]);
      setCartItems([]);
      toast.success(
        `Reservation submitted successfully! Order #${normalized.orderNumber}`,
        {
          description: "You will receive a confirmation email within 24 hours."
        }
      );
      setCurrentView("orders");
      setUserProfile({
        fullName: order.studentName,
        studentId: order.studentId,
        phone: order.phone,
        department: order.department,
        courseYear: order.courseYear,
      });
      await refreshOrders(order.email);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit reservation. Please try again.");
    }
  };

  const handleCancelReservation = () => {
    setCurrentView("shop");
    toast.info("Reservation cancelled");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      await api.adminLogin(email, password);
      setIsAdminAuthenticated(true);
      setAdminEmail(email);
      setCurrentView("admin-dashboard");
      toast.success("Admin logged in");
      await refreshOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Admin login error:", errorMessage);
      
      // Provide more helpful error messages
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        toast.error("Cannot connect to server. Make sure XAMPP Apache is running and PHP API is set up.");
      } else if (errorMessage.includes("Invalid credentials") || errorMessage.includes("401")) {
        toast.error("Invalid admin credentials. Email: admin@mmsu.edu.ph, Password: admin123");
      } else {
        toast.error(`Login failed: ${errorMessage}`);
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setCurrentView("home");
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await api.updateOrderStatus(Number(orderId), status);
      const next = orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
      );
      setOrders(next);
      toast.success(`Order updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }
    try {
      await api.deleteOrder(Number(orderId));
      setOrders(orders.filter((o) => o.id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleSaveProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await api.updateProduct(Number(productId), {
        ...updates,
        image_url: updates.image,
        in_stock: updates.inStock,
        stock_count: updates.stockCount,
      });
      setProductsState((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
      );
      toast.success("Product updated");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const created = await api.addProduct({
        legacy_id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        department: newProduct.department,
        image_url: newProduct.image,
        in_stock: newProduct.inStock,
        stock_count: newProduct.stockCount,
        sizes: newProduct.sizes,
      });
      const normalized = mapApiProduct(created);
      setProductsState((prev) => [normalized, ...prev]);
      toast.success("Product added");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(Number(productId));
      setProductsState((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateProfile = (profileData: UserProfileData) => {
    setUserProfile(profileData);
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onNavigate={handleNavigate}
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        isAdminAuthenticated={isAdminAuthenticated}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto my-8 px-4 flex-1 w-full">
        {productsLoading && (
          <div className="text-center py-10 text-muted-foreground">Loading catalog...</div>
        )}
        {apiError && <p className="text-center text-red-600">{apiError}</p>}
        {!isAuthenticated && currentView === "home" && !productsLoading && (
          <LoginPage onLogin={handleLogin} />
        )}
        {currentView === "admin-login" && (
          <AdminLoginPage onAdminLogin={handleAdminLogin} onBack={() => handleNavigate("home")} />
        )}
        {isAdminAuthenticated && currentView === "admin-dashboard" && (
          <AdminDashboard
            adminEmail={adminEmail}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onLogoutAdmin={handleAdminLogout}
            onNavigateProducts={() => setCurrentView("admin-products")}
          />
        )}
        {isAuthenticated && currentView === "shop" && !productsLoading && (
          <Shop products={productsState} onAddToCart={handleAddToCart} />
        )}
        {isAuthenticated && currentView === "contact" && <ContactPage />}
        {isAuthenticated && currentView === "home" && !productsLoading && (
          <Shop products={productsState} onAddToCart={handleAddToCart} />
        )}
        {isAuthenticated && currentView === "profile" && (
          <UserProfile profile={userProfile} email={userEmail} onSave={handleUpdateProfile} />
        )}
        {isAdminAuthenticated && currentView === "admin-products" && (
          <AdminProducts
            products={productsState}
            onSaveProduct={handleSaveProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onBack={() => setCurrentView("admin-dashboard")}
          />
        )}
        {isAuthenticated && currentView === "reservation" && (
          <ReservationForm
            cartItems={cartItems}
            userEmail={userEmail}
            onSubmitOrder={handleSubmitOrder}
            onCancel={handleCancelReservation}
            initialProfile={userProfile}
          />
        )}
        {isAuthenticated && currentView === "orders" && (
          ordersLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading your orders...</div>
          ) : (
            <OrderStatus
              orders={orders}
              onBackToShop={() => handleNavigate("shop")}
            />
          )
        )}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}