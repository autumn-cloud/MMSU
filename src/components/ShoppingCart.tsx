import { CartItem } from "../types/product";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}: ShoppingCartProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-[#FFD700] hover:bg-[#D4AF37] text-[#1B5E20] relative shadow-md">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-[#1B5E20] text-white">
            {totalItems}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
          <SheetDescription>
            Review your selected items and proceed to checkout
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="mb-1">{item.product.name}</h4>
                    <p className="text-gray-600 mb-2">
                      Size: {item.size}
                    </p>
                    <p className="text-[#1B5E20]">
                      ₱{item.product.price.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(index, Math.min(5, item.quantity + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#1B5E20]">₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="text-[#1B5E20]">₱50.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-[#1B5E20]">₱{(totalPrice + 50).toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white"
              >
                Proceed to Reserve & Order
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
