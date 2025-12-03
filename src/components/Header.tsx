import ShoppingCart from "./ShoppingCart";
import { CartItem } from "../types/product";
import { LogOut, User } from "lucide-react";
import mmsuLogo from "../assets/mmsu-logo.png";

interface HeaderProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  isAuthenticated: boolean;
  isAdminAuthenticated?: boolean;
  userEmail: string;
  onLogout: () => void;
}

export default function Header({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onNavigate,
  currentView,
  isAuthenticated,
  isAdminAuthenticated = false,
  userEmail,
  onLogout
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <img
              src={mmsuLogo}
              alt="MMSU Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white p-1 border border-[#FFD700] shadow"
            />
            <div>
              <h1
                className="m-0 cursor-pointer"
                onClick={() =>
                  onNavigate(isAdminAuthenticated ? "admin-dashboard" : isAuthenticated ? "shop" : "home")
                }
              >
                MMSU Fits and Finds
              </h1>
              <p className="text-sm text-[#FFD700] m-0">Official University Apparel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isAuthenticated && !isAdminAuthenticated && (
              <button
                onClick={() => onNavigate("admin-login")}
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                Admin
              </button>
            )}
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-md">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{userEmail.split("@")[0]}</span>
                </div>
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                  onCheckout={onCheckout}
                />
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-white hover:text-[#FFD700] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
        {isAuthenticated && (
          <nav className="flex justify-center gap-6">
            <button
              onClick={() => onNavigate("shop")}
              className={`text-white no-underline hover:text-[#FFD700] transition-colors ${currentView === "shop" ? "text-[#FFD700]" : ""}`}
            >
              Browse Apparel
            </button>
            <button
              onClick={() => onNavigate("orders")}
              className={`text-white no-underline hover:text-[#FFD700] transition-colors ${currentView === "orders" ? "text-[#FFD700]" : ""}`}
            >
              My Orders
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className={`text-white no-underline hover:text-[#FFD700] transition-colors ${currentView === "contact" ? "text-[#FFD700]" : ""}`}
            >
              Contact Us
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className={`text-white no-underline hover:text-[#FFD700] transition-colors ${currentView === "profile" ? "text-[#FFD700]" : ""}`}
            >
              Profile
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}