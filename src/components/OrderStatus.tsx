import { Order } from "../types/product";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  PackageCheck,
  User,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  Users,
  Info,
} from "lucide-react";

interface OrderStatusProps {
  orders: Order[];
  onBackToShop: () => void;
}

export default function OrderStatus({ orders, onBackToShop }: OrderStatusProps) {
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "ready-for-pickup":
        return <PackageCheck className="w-5 h-5 text-green-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-[#1B5E20]" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      "ready-for-pickup": "bg-green-100 text-green-800 border-green-300",
      completed: "bg-[#1B5E20] text-white border-[#1B5E20]",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };

    const labels: Record<Order["status"], string> = {
      pending: "Pending Confirmation",
      confirmed: "Confirmed",
      "ready-for-pickup": "Ready for Pickup",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const getStatusMessage = (order: Order) => {
    switch (order.status) {
      case "pending":
        return "Your reservation has been received and is awaiting confirmation from the department office.";
      case "confirmed":
        return "Your order has been confirmed! The items are being prepared.";
      case "ready-for-pickup":
        if (order.deliveryMethod === "department-pickup") {
          return `Your order is ready for pickup at the ${order.department} office during office hours (8:00 AM - 5:00 PM, Monday to Friday).`;
        } else {
          return `Your order is ready. The class representative (${order.classRepresentative?.name}) can pick it up at the ${order.department} office.`;
        }
      case "completed":
        return "Your order has been completed. Thank you for using MMSU Fits and Finds!";
      case "cancelled":
        return "This order has been cancelled. Please contact the department office for more information.";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-[#1B5E20] mb-4">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to make your first reservation!
        </p>
        <Button
          onClick={onBackToShop}
          className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white"
        >
          Browse Apparel
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#1B5E20] m-0">My Orders</h2>
        <Button
          onClick={onBackToShop}
          variant="outline"
          className="border-[#1B5E20] text-[#1B5E20] hover:bg-[#f1f8e9]"
        >
          Continue Shopping
        </Button>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-lg border-t-4 border-[#1B5E20] p-6"
        >
          {/* Order Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(order.status)}
                <h3 className="text-[#1B5E20] m-0">Order #{order.orderNumber}</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Status Message */}
          <Alert className="mb-4 bg-[#f1f8e9] border-[#2E7D32]">
            <Info className="h-4 w-4 text-[#1B5E20]" />
            <AlertDescription className="text-[#1B5E20]">
              {getStatusMessage(order)}
            </AlertDescription>
          </Alert>

          <Separator className="my-4" />

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[#1B5E20]" />
                <span className="text-muted-foreground">Student:</span>
                <span>{order.studentName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-[#1B5E20]" />
                <span className="text-muted-foreground">ID:</span>
                <span>{order.studentId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-[#1B5E20]" />
                <span className="text-muted-foreground">Phone:</span>
                <span>{order.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#1B5E20]" />
                <span className="text-muted-foreground">Department:</span>
                <span>{order.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-[#1B5E20]" />
                <span className="text-muted-foreground">Course & Year:</span>
                <span>{order.courseYear}</span>
              </div>
            </div>
          </div>

          {/* Pickup Method */}
          <div className="bg-muted p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#1B5E20]" />
              <span>Pickup Method:</span>
            </div>
            {order.deliveryMethod === "department-pickup" ? (
              <p className="text-sm text-muted-foreground m-0 ml-6">
                Department Office Pickup - {order.department}
              </p>
            ) : (
              <div className="ml-6 space-y-1">
                <p className="text-sm m-0">Class Section Representative Delivery</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>
                    Representative: {order.classRepresentative?.name} (ID: {order.classRepresentative?.studentId})
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Order Items */}
          <div className="space-y-3 mb-4">
            <h4 className="text-[#1B5E20] m-0">Items Ordered</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-muted p-3 rounded">
                <div className="flex-1">
                  <p className="m-0">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground m-0">
                    Size {item.size} × {item.quantity}
                  </p>
                </div>
                <p className="m-0">₱{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#1B5E20] text-white p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Total Amount:</span>
              <span className="text-[#FFD700]">₱{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
