import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#1B5E20]">
        <h2 className="text-[#1B5E20] mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have questions about ordering, sizing, or availability? We're here to help!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[#1B5E20] mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#1B5E20] mt-1" />
                <div>
                  <p>MMSU Main Campus</p>
                  <p className="text-gray-600">City of Batac, Ilocos Norte, Philippines</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#1B5E20] mt-1" />
                <div>
                  <p>(077) 792-3531</p>
                  <p className="text-gray-600">Monday - Friday, 8:00 AM - 5:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#1B5E20] mt-1" />
                <div>
                  <p>fitsandfinds@mmsu.edu.ph</p>
                  <p className="text-gray-600">We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#1B5E20] mt-1" />
                <div>
                  <p>Office Hours</p>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Saturday: 8:00 AM - 12:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1B5E20] mb-4">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" required />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required />
              </div>
              
              <div>
                <Label htmlFor="studentId">Student ID (Optional)</Label>
                <Input id="studentId" type="text" />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} required />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#FFD700]">
        <h3 className="text-[#1B5E20] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2">How do I know my size?</h4>
            <p className="text-gray-600">
              We recommend visiting our office for accurate measurements. You can also refer to our sizing guide available on each product page.
            </p>
          </div>
          
          <div>
            <h4 className="mb-2">Can I change my order after placing it?</h4>
            <p className="text-gray-600">
              Yes, you can modify your order within 24 hours of placement by contacting us directly.
            </p>
          </div>
          
          <div>
            <h4 className="mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600">
              We currently accept cash payments upon pickup. Online payment options will be available soon.
            </p>
          </div>
          
          <div>
            <h4 className="mb-2">How long does it take to process my order?</h4>
            <p className="text-gray-600">
              Standard orders are processed within 3-5 business days. You'll receive a notification when your order is ready for pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
