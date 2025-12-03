import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { CartItem, DeliveryMethod, Order } from "../types/product";
import { Package, User, Phone, Mail, GraduationCap, Users, ShoppingBag, Info } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { UserProfileData } from "./UserProfile";

interface ReservationFormProps {
  cartItems: CartItem[];
  userEmail: string;
  onSubmitOrder: (order: Order) => void;
  onCancel: () => void;
  initialProfile?: UserProfileData;
}

export default function ReservationForm({
  cartItems,
  userEmail,
  onSubmitOrder,
  onCancel,
  initialProfile,
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    phone: "",
    department: "",
    courseYear: "",
    deliveryMethod: "department-pickup" as DeliveryMethod,
    repName: "",
    repStudentId: "",
    repPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input validation helpers
  const allowStringOnly = (value: string): string => {
    // Allow letters, spaces, hyphens, apostrophes, and periods
    return value.replace(/[^a-zA-Z\s\-'.]/g, '');
  };

  const allowNumbersOnly = (value: string): string => {
    // Allow digits and common special characters (hyphens, slashes, underscores, etc.)
    return value.replace(/[^0-9\-\/_\.]/g, '');
  };

  const allowPhoneNumbers = (value: string): string => {
    // Allow numbers and + at the start for country code
    if (value.startsWith('+')) {
      return '+' + value.slice(1).replace(/\D/g, '');
    }
    return value.replace(/\D/g, '');
  };

  useEffect(() => {
    if (initialProfile) {
      setFormData((prev) => ({
        ...prev,
        studentName: initialProfile.fullName || prev.studentName,
        studentId: initialProfile.studentId || prev.studentId,
        phone: initialProfile.phone || prev.phone,
        department: initialProfile.department || prev.department,
        courseYear: initialProfile.courseYear || prev.courseYear,
      }));
    }
  }, [initialProfile]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const serviceFee = 50;
  const total = subtotal + serviceFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.courseYear.trim()) newErrors.courseYear = "Course and year is required";

    if (formData.deliveryMethod === "class-representative") {
      if (!formData.repName.trim()) newErrors.repName = "Representative name is required";
      if (!formData.repStudentId.trim()) newErrors.repStudentId = "Representative ID is required";
      if (!formData.repPhone.trim()) newErrors.repPhone = "Representative phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const order: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `MMSU-${Date.now().toString().slice(-8)}`,
      studentName: formData.studentName,
      studentId: formData.studentId,
      email: userEmail,
      phone: formData.phone,
      department: formData.department,
      courseYear: formData.courseYear,
      items: cartItems,
      deliveryMethod: formData.deliveryMethod,
      classRepresentative:
        formData.deliveryMethod === "class-representative"
          ? {
              name: formData.repName,
              studentId: formData.repStudentId,
              phone: formData.repPhone,
            }
          : undefined,
      totalAmount: total,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmitOrder(order);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border-t-4 border-[#1B5E20] p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-8 h-8 text-[#1B5E20]" />
          <h2 className="text-[#1B5E20] m-0">Complete Your Reservation</h2>
        </div>

        <Alert className="mb-6 bg-[#f1f8e9] border-[#2E7D32]">
          <Info className="h-4 w-4 text-[#1B5E20]" />
          <AlertDescription className="text-[#1B5E20]">
            <strong>Pickup Instructions:</strong> You may pick up your order at your respective department office
            or choose to have your class section representative collect it for delivery to your class.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-[#1B5E20] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => {
                    const filtered = allowStringOnly(e.target.value);
                    setFormData({ ...formData, studentName: filtered });
                  }}
                  className={errors.studentName ? "border-destructive" : ""}
                />
                {errors.studentName && (
                  <p className="text-sm text-destructive">{errors.studentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => {
                    const filtered = allowNumbersOnly(e.target.value);
                    setFormData({ ...formData, studentId: filtered });
                  }}
                  className={errors.studentId ? "border-destructive" : ""}
                />
                {errors.studentId && (
                  <p className="text-sm text-destructive">{errors.studentId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => {
                    const filtered = allowPhoneNumbers(e.target.value);
                    setFormData({ ...formData, phone: filtered });
                  }}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={userEmail} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department/College *</Label>
                <Input
                  id="department"
                  placeholder="e.g., College of Engineering"
                  value={formData.department}
                  onChange={(e) => {
                    const filtered = allowStringOnly(e.target.value);
                    setFormData({ ...formData, department: filtered });
                  }}
                  className={errors.department ? "border-destructive" : ""}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseYear">Course & Year *</Label>
                <Input
                  id="courseYear"
                  placeholder="e.g., BSCS 3rd Year"
                  value={formData.courseYear}
                  onChange={(e) =>
                    setFormData({ ...formData, courseYear: e.target.value })
                  }
                  className={errors.courseYear ? "border-destructive" : ""}
                />
                {errors.courseYear && (
                  <p className="text-sm text-destructive">{errors.courseYear}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Method */}
          <div>
            <h3 className="text-[#1B5E20] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pickup Method
            </h3>
            <RadioGroup
              value={formData.deliveryMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, deliveryMethod: value as DeliveryMethod })
              }
            >
              <div className="flex items-start space-x-3 bg-[#f1f8e9] p-4 rounded-lg border border-[#2E7D32]">
                <RadioGroupItem value="department-pickup" id="department" />
                <div className="flex-1">
                  <Label htmlFor="department" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-[#1B5E20]" />
                      <span>Department Office Pickup</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pick up your order at your respective department/college office during office hours (8:00 AM - 5:00 PM, Monday to Friday).
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-[#f1f8e9] p-4 rounded-lg border border-[#2E7D32]">
                <RadioGroupItem value="class-representative" id="representative" />
                <div className="flex-1">
                  <Label htmlFor="representative" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#1B5E20]" />
                      <span>Class Section Representative Delivery</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your designated class representative will collect the order from the department office and deliver it to your class section.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Class Representative Details */}
          {formData.deliveryMethod === "class-representative" && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h4 className="text-[#1B5E20] mb-3">Class Representative Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repName">Representative Name *</Label>
                  <Input
                    id="repName"
                    value={formData.repName}
                    onChange={(e) => {
                      const filtered = allowStringOnly(e.target.value);
                      setFormData({ ...formData, repName: filtered });
                    }}
                    className={errors.repName ? "border-destructive" : ""}
                  />
                  {errors.repName && (
                    <p className="text-sm text-destructive">{errors.repName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repStudentId">Representative ID *</Label>
                  <Input
                    id="repStudentId"
                    value={formData.repStudentId}
                    onChange={(e) => {
                      const filtered = allowNumbersOnly(e.target.value);
                      setFormData({ ...formData, repStudentId: filtered });
                    }}
                    className={errors.repStudentId ? "border-destructive" : ""}
                  />
                  {errors.repStudentId && (
                    <p className="text-sm text-destructive">{errors.repStudentId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repPhone">Representative Phone *</Label>
                  <Input
                    id="repPhone"
                    type="tel"
                    value={formData.repPhone}
                    onChange={(e) => {
                      const filtered = allowPhoneNumbers(e.target.value);
                      setFormData({ ...formData, repPhone: filtered });
                    }}
                    className={errors.repPhone ? "border-destructive" : ""}
                  />
                  {errors.repPhone && (
                    <p className="text-sm text-destructive">{errors.repPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="text-[#1B5E20] mb-4">Order Summary</h3>
            <div className="bg-muted p-4 rounded-lg space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="m-0">
                      {item.product.name} <span className="text-muted-foreground">(Size {item.size})</span>
                    </p>
                    <p className="text-sm text-muted-foreground m-0">Qty: {item.quantity}</p>
                  </div>
                  <p className="m-0">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p className="m-0">Subtotal:</p>
                <p className="m-0">₱{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <p className="m-0">Service Fee:</p>
                <p className="m-0">₱{serviceFee.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between">
                <p className="m-0">Total Amount:</p>
                <p className="m-0 text-[#1B5E20]">₱{total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white"
            >
              Submit Reservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
