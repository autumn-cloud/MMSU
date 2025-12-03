import { Order } from "../types/product";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface AdminDashboardProps {
  adminEmail: string;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onLogoutAdmin: () => void;
  onNavigateProducts?: () => void;
}

export default function AdminDashboard({ adminEmail, orders, onUpdateOrderStatus, onLogoutAdmin, onNavigateProducts }: AdminDashboardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[#1B5E20]">Admin Dashboard</h2>
        <div className="flex items-center gap-3 text-sm">
          {onNavigateProducts && (
            <Button variant="outline" onClick={onNavigateProducts}>Manage Products</Button>
          )}
          <span className="bg-[#f1f8e9] px-3 py-1 rounded-md border border-[#2E7D32]">{adminEmail}</span>
          <Button variant="outline" onClick={onLogoutAdmin}>Logout</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservations & Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 && <p className="m-0 text-muted-foreground">No orders yet.</p>}
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded border p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="m-0 font-medium">{order.orderNumber}</p>
                  <p className="m-0 text-sm text-muted-foreground">{order.studentName} · {order.email}</p>
                </div>
                <div className="text-right">
                  <p className="m-0">₱{order.totalAmount.toFixed(2)}</p>
                  <p className="m-0 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <Separator className="my-3" />
              {order.items && order.items.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground m-0 mb-2">Ordered Items</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <Badge key={`${order.id}-${idx}`} className="bg-[#f1f8e9] text-[#1B5E20] border-[#2E7D32]">
                        {item.product?.name ?? "Item"} · {item.size} · ×{item.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Status:</span>
                <span className="text-sm px-2 py-1 rounded bg-[#f1f8e9] border border-[#2E7D32]">{order.status}</span>
                <div className="flex gap-2 ml-auto">
                  <Button size="sm" variant="outline" onClick={() => onUpdateOrderStatus(order.id, "confirmed")}>Confirm</Button>
                  <Button size="sm" variant="outline" onClick={() => onUpdateOrderStatus(order.id, "ready-for-pickup")}>Ready</Button>
                  <Button size="sm" variant="outline" onClick={() => onUpdateOrderStatus(order.id, "completed")}>Complete</Button>
                  <Button size="sm" variant="destructive" onClick={() => onUpdateOrderStatus(order.id, "cancelled")}>Cancel</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


