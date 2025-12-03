import { useMemo, useState } from "react";
import { Product } from "../types/product";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface AdminProductsProps {
  products: Product[];
  onSaveProduct: (productId: string, updates: Partial<Product>) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBack: () => void;
}

export default function AdminProducts({ products, onSaveProduct, onAddProduct, onDeleteProduct, onBack }: AdminProductsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<Partial<Product>>({
    name: "",
    description: "",
    department: "",
    category: "",
    price: 0,
    image: "",
    sizes: ["S","M","L"],
    inStock: true,
    stockCount: 0,
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setDraft({ ...p, sizes: [...p.sizes] });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    onSaveProduct(editingId, normalizeDraft(draft));
    setEditingId(null);
    setDraft({});
  };

  const normalizeDraft = (d: Partial<Product>): Partial<Product> => {
    const normalized: Partial<Product> = { ...d };
    if (typeof normalized.price === "string") normalized.price = parseFloat(normalized.price as unknown as string);
    if (typeof normalized.stockCount === "string") normalized.stockCount = parseInt(normalized.stockCount as unknown as string, 10);
    if (typeof normalized.sizes === "string") {
      normalized.sizes = (normalized.sizes as unknown as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return normalized;
  };

  const editingProduct = useMemo(() => products.find((p) => p.id === editingId) || null, [editingId, products]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[#1B5E20]">Manage Products</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAdding(true)}>Add New Product</Button>
          <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">In Stock</th>
                  <th className="p-2">Sizes</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.department}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">₱{p.price.toFixed(2)}</td>
                    <td className="p-2">{p.stockCount}</td>
                    <td className="p-2">{p.inStock ? "Yes" : "No"}</td>
                    <td className="p-2">{p.sizes.join(", ")}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteProduct(p.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={(newDraft.name as string) ?? ""} onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={(newDraft.department as string) ?? ""} onChange={(e) => setNewDraft({ ...newDraft, department: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={(newDraft.category as string) ?? ""} onChange={(e) => setNewDraft({ ...newDraft, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={(newDraft.price as number | string) ?? 0} onChange={(e) => setNewDraft({ ...newDraft, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stock Count</Label>
                <Input type="number" value={(newDraft.stockCount as number | string) ?? 0} onChange={(e) => setNewDraft({ ...newDraft, stockCount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={(newDraft.image as string) ?? ""} onChange={(e) => setNewDraft({ ...newDraft, image: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Sizes (comma-separated)</Label>
                <Input value={(typeof newDraft.sizes === "string" ? (newDraft.sizes as unknown as string) : (newDraft.sizes ? (newDraft.sizes as string[]).join(", ") : "S, M, L"))} onChange={(e) => setNewDraft({ ...newDraft, sizes: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>In Stock (true/false)</Label>
                <Input value={(typeof newDraft.inStock === "boolean" ? String(newDraft.inStock) : "true")} onChange={(e) => setNewDraft({ ...newDraft, inStock: e.target.value.toLowerCase() === "true" })} />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewDraft({}); }}>Cancel</Button>
              <Button onClick={() => {
                const normalized = normalizeDraft(newDraft);
                const created: Product = {
                  id: `prod_${Date.now()}`,
                  name: (normalized.name as string) || "Untitled",
                  description: (normalized.description as string) || "",
                  price: (normalized.price as number) || 0,
                  category: (normalized.category as string) || "",
                  department: (normalized.department as string) || "",
                  image: (normalized.image as string) || "",
                  sizes: (normalized.sizes as string[]) || ["S","M","L"],
                  inStock: (normalized.inStock as boolean) ?? true,
                  stockCount: (normalized.stockCount as number) || 0,
                };
                onAddProduct(created);
                setIsAdding(false);
                setNewDraft({});
              }} className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">Add Product</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Edit: {editingProduct.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={(draft.name as string) ?? editingProduct.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={(draft.department as string) ?? editingProduct.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={(draft.category as string) ?? editingProduct.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={(draft.price as number | string) ?? editingProduct.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stock Count</Label>
                <Input type="number" value={(draft.stockCount as number | string) ?? editingProduct.stockCount} onChange={(e) => setDraft({ ...draft, stockCount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Image URL (or keep existing)</Label>
                <Input value={(draft.image as string) ?? editingProduct.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Sizes (comma-separated)</Label>
                <Input value={(typeof draft.sizes === "string" ? (draft.sizes as unknown as string) : (draft.sizes ? (draft.sizes as string[]).join(", ") : editingProduct.sizes.join(", ")))} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>In Stock (true/false)</Label>
                <Input value={(typeof draft.inStock === "boolean" ? String(draft.inStock) : String(editingProduct.inStock))} onChange={(e) => setDraft({ ...draft, inStock: e.target.value.toLowerCase() === "true" })} />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={saveEdit} className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


