import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { ShoppingBag, Lock, User } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email, password);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#1B5E20] mb-2">MMSU Fits and Finds</h1>
          <p className="text-muted-foreground">
            Mariano Marcos State University
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#1B5E20]">
          <h2 className="text-[#1B5E20] mb-6 text-center">Student Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Student Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@mmsu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input-background border-border focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input-background border-border focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-[#1B5E20] focus:ring-[#2E7D32]"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a
                href="#"
                className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Please contact the university registrar for password assistance");
                }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-90 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </div>

        {/* Info Section */}
        <div className="mt-6 bg-muted p-4 rounded-lg border border-border">
          <p className="text-sm text-center text-muted-foreground">
            <strong className="text-[#1B5E20]">Note:</strong> Use your official MMSU student email and portal password to access the shop.
          </p>
        </div>
      </div>
    </div>
  );
}
