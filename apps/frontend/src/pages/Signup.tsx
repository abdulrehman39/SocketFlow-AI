import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Orbit } from "lucide-react";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup for MVP
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-apple text-white mb-5">
            <Orbit className="w-8 h-8" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="text-[15px] text-muted mt-1">Start building real-time apps instantly</p>
        </div>

        <Card className="bg-white p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-foreground">Full Name</label>
              <Input 
                type="text" 
                placeholder="Steve Jobs" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-foreground">Email Address</label>
              <Input 
                type="email" 
                placeholder="you@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-foreground">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button variant="primary" type="submit" className="w-full py-3 mt-2 font-semibold">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-[14px] text-muted">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
