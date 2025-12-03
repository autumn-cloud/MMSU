import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AdminLoginPageProps {
  onAdminLogin: (email: string, password: string) => void;
  onBack?: () => void;
}

export default function AdminLoginPage({ onAdminLogin, onBack }: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminLogin(email.trim(), password);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border-t-4 border-[#1B5E20] p-8">
      <h2 className="text-[#1B5E20] m-0 mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex gap-3 pt-2">
          {onBack && (
            <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
            Log in
          </Button>
        </div>
      </form>
    </div>
  );
}


