import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Hash, Activity } from "lucide-react";

export function Channels() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-foreground">Active Channels</h1>
        <p className="text-[17px] text-muted mt-1">Real-time overview of your Pub/Sub channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["global_alerts", "user_notifications", "market_data"].map((ch, i) => (
          <Card key={i} className="hover:shadow-apple-lg hover:border-primary/30 transition-all group cursor-pointer bg-white">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-primary group-hover:border-primary transition-colors">
                <Hash className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-[13px] font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <Activity className="w-3.5 h-3.5" />
                Live
              </div>
            </div>
            <h3 className="font-semibold text-[19px] text-foreground mb-1">{ch}</h3>
            <p className="text-muted text-[15px]">{Math.floor(Math.random() * 5000).toLocaleString()} active subscribers</p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
