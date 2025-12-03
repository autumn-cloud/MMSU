import { useState } from "react";
import { Product } from "../types/product";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    onAddToCart(product, selectedSize, quantity);
    setSelectedSize("");
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stockCount < 20 && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            Low Stock
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2 border-[#1B5E20] text-[#1B5E20]">
            {product.department}
          </Badge>
          <h3 className="text-[#1B5E20] mb-1">{product.name}</h3>
          <p className="text-gray-600 mb-3">{product.description}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-[#1B5E20]">₱{product.price.toFixed(2)}</p>
          <p className="text-gray-500">
            {product.stockCount} items available
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={quantity.toString()} 
              onValueChange={(val) => setQuantity(parseInt(val))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
