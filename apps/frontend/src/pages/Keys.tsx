import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Key, Copy, Trash2, X } from "lucide-react";

export function Keys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const token = localStorage.getItem("token");

  const fetchKeys = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (err) {
      console.error("Failed to fetch keys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    setIsCreating(true);
    try {
      const res = await fetch(`${apiUrl}/api/keys`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name: newName,
          endpointUrl: newEndpointUrl 
        })
      });
      if (res.ok) {
        await fetchKeys();
        setIsModalOpen(false);
        setNewName("");
        setNewEndpointUrl("");
      } else {
        alert("Failed to create key");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this key?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/keys/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setKeys(keys.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (keyStr: string) => {
    navigator.clipboard.writeText(keyStr);
    alert("Key copied to clipboard");
  };

  return (
    <>
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
          <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
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
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[12px]">ENDPOINT URL</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[12px]">CREATED</th>
                <th className="px-6 py-4 font-semibold text-right uppercase tracking-wider text-[12px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted">Loading keys...</td></tr>
              ) : keys.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted">No API keys found. Create one to get started.</td></tr>
              ) : keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 font-medium text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                       <Key className="w-4 h-4 text-primary" />
                    </div>
                    {k.name}
                  </td>
                  <td className="px-6 py-5 font-mono text-muted">
                    <div className="flex items-center gap-3">
                      {k.key}
                      <button onClick={() => handleCopy(k.key)} className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-muted">{k.endpointUrl || <span className="text-slate-300 italic">None</span>}</td>
                  <td className="px-6 py-5 text-muted">{new Date(k.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => handleDeleteKey(k.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-muted transition-colors cursor-pointer inline-flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-apple-lg w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <h3 className="text-lg font-semibold text-foreground">Create API Key</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateKey} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-foreground">Key Name <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="e.g. Production Key" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-foreground">Endpoint Base URL (Optional)</label>
                  <p className="text-[12px] text-muted mb-2">Used for delivering webhooks and events to your specific server.</p>
                  <Input 
                    type="url"
                    placeholder="https://your-api.com" 
                    value={newEndpointUrl}
                    onChange={(e) => setNewEndpointUrl(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isCreating || !newName}>
                    {isCreating ? "Creating..." : "Generate Key"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
