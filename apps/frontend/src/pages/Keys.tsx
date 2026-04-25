import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Plus, Key, Copy, MoreHorizontal } from "lucide-react";

export function Keys() {
  const keys = [
    { name: "Production Key", key: "sk_live_...", created: "Oct 12, 2025" },
    { name: "Development", key: "sk_test_...", created: "Nov 01, 2025" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-foreground">API Keys</h1>
          <p className="text-[17px] text-muted mt-1">Manage your secret keys to authenticate with SocketFlow.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Key
        </Button>
      </div>

      <Card className="overflow-hidden p-0 bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f9f9fb] text-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[12px]">NAME</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[12px]">SECRET KEY</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[12px]">CREATED</th>
              <th className="px-6 py-4 font-semibold text-right uppercase tracking-wider text-[12px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {keys.map((k, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 font-medium text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                     <Key className="w-4 h-4 text-primary" />
                  </div>
                  {k.name}
                </td>
                <td className="px-6 py-5 font-mono text-muted">
                  <div className="flex items-center gap-3">
                    {k.key}
                    <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5 text-muted">{k.created}</td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded-full text-muted transition-colors cursor-pointer inline-flex items-center justify-center">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
