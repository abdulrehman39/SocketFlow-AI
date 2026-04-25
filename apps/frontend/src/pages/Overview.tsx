import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Activity, Zap, Users, ShieldAlert } from "lucide-react";

export function Overview() {
  const [metrics, setMetrics] = useState({ active: 0, msgs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        active: prev.active + Math.floor(Math.random() * 3),
        msgs: prev.msgs + Math.floor(Math.random() * 10)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-foreground">Overview</h1>
        <p className="text-[17px] text-muted mt-1">Monitor your real-time infrastructure at a glance.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Active Connections", value: `1,2${metrics.active}`, icon: Users, color: "text-primary" },
          { label: "Messages / min", value: `8,${metrics.msgs}42`, icon: Zap, color: "text-orange-500" },
          { label: "Avg Latency", value: "24ms", icon: Activity, color: "text-emerald-500" },
          { label: "Error Rate", value: "0.01%", icon: ShieldAlert, color: "text-rose-500" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card className="hover:shadow-apple-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[14px] font-medium text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-[32px] font-bold text-foreground mt-1 tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full bg-slate-50 border border-border/50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Feed Mockup */}
      <Card className="h-[400px] flex flex-col bg-white">
        <h2 className="text-[19px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,113,227,0.6)]" />
          Live Event Feed
        </h2>
        <div className="flex-1 border border-border/60 bg-[#f9f9fb] rounded-2xl p-5 font-mono text-[13px] text-muted overflow-y-auto shadow-inner">
          <div className="space-y-3">
             <p><span className="text-primary font-medium">[10:02:43]</span> <span className="text-slate-500 font-medium">SYS</span> Connection established (Node: sg-1)</p>
             <p><span className="text-primary font-medium">[10:02:45]</span> <span className="text-emerald-500 font-medium">MSG</span> Event 'notification' delivered to channel 'global'</p>
             <p><span className="text-primary font-medium">[10:02:50]</span> <span className="text-emerald-500 font-medium">MSG</span> Event 'payment' delivered to channel 'user_123'</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
