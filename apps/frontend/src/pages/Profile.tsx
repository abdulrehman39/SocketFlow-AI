import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { User } from "lucide-react";

export function Profile() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl"
    >
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-foreground flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          My Profile
        </h1>
        <p className="text-[17px] text-muted mt-1">Manage your account settings and personal information.</p>
      </div>

      <Card className="bg-white">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">Full Name</label>
            <Input defaultValue="Steve Jobs" />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">Email Address</label>
            <Input defaultValue="steve@apple.com" disabled className="bg-[#f5f5f7] text-muted cursor-not-allowed" />
            <p className="text-[12px] text-muted">Email address cannot be changed for this MVP.</p>
          </div>
          <div className="pt-4 border-t border-[#e5e5ea] flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
