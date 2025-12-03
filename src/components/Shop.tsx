import { useState } from "react";
import { Product } from "../types/product";
import { departments } from "../data/products";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface ShopProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function Shop({ products, onAddToCart }: ShopProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("All Colleges");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesDepartment = selectedDepartment === "All Colleges" || product.department === selectedDepartment;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#1B5E20]">
        <h2 className="text-[#1B5E20] mb-4">Browse Official MMSU Uniforms</h2>
        <p className="text-gray-600 mb-4">
          Find all your official university apparel in one place. Select your college, choose your size, and reserve your items online.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search uniforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <p className="mb-3">Filter by College:</p>
            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <Button
                  key={department}
                  variant={selectedDepartment === department ? "default" : "outline"}
                  onClick={() => setSelectedDepartment(department)}
                  className={selectedDepartment === department ? "bg-[#1B5E20] hover:bg-[#2E7D32]" : "border-[#1B5E20] text-[#1B5E20] hover:bg-[#f1f8e9]"}
                >
                  {department}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
