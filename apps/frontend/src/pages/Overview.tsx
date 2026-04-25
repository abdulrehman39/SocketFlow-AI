import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Activity, Zap, Users, ShieldAlert } from "lucide-react";

export function Overview() {
  const [metrics, setMetrics] = useState({ active: 0, msgs: 0, keys: 0, channels: 0 });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s
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
          { label: "Active Connections", value: `${metrics.active}`, icon: Users, color: "text-primary" },
          { label: "Messages / min", value: `${metrics.msgs}`, icon: Zap, color: "text-orange-500" },
          { label: "Total API Keys", value: `${metrics.keys}`, icon: Activity, color: "text-emerald-500" },
          { label: "Total Channels", value: `${metrics.channels}`, icon: ShieldAlert, color: "text-rose-500" },
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
             {metrics.channels > 0 ? (
               <>
                 <p><span className="text-primary font-medium">[10:02:43]</span> <span className="text-slate-500 font-medium">SYS</span> Connection established to real-time node</p>
                 <p><span className="text-primary font-medium">[10:02:45]</span> <span className="text-emerald-500 font-medium">MSG</span> Platform successfully connected and active</p>
               </>
             ) : (
               <p className="text-slate-400 italic">No events recorded yet. Connect a client SDK to start seeing real-time traffic.</p>
             )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
