import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { BookOpen, Code, Terminal } from "lucide-react";

export function Docs() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Documentation
        </h1>
        <p className="text-[17px] text-muted mt-1">Learn how to integrate SocketFlow into your application.</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-white hover:shadow-apple-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-primary" />
            <h2 className="text-[22px] font-semibold text-foreground">1. Install the SDK</h2>
          </div>
          <p className="text-[15px] text-muted mb-4">
            SocketFlow provides a lightweight, typed client for connecting to your channels on the frontend.
          </p>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 font-mono text-[14px] text-foreground">
            <span className="text-primary">npm</span> install socket.io-client
          </div>
        </Card>

        <Card className="bg-white hover:shadow-apple-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="text-[22px] font-semibold text-foreground">2. Initialize and Subscribe (Frontend)</h2>
          </div>
          <p className="text-[15px] text-muted mb-4">
            Import the client, authenticate with your secret key, and subscribe to a channel.
          </p>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 font-mono text-[14px] text-foreground overflow-x-auto whitespace-pre">
<span className="text-pink-500">import</span> {`{ io }`} <span className="text-pink-500">from</span> <span className="text-emerald-500">'socket.io-client'</span>;

<span className="text-pink-500">const</span> socket = <span className="text-primary">io</span>(<span className="text-emerald-500">'{apiUrl}'</span>, {`{
  auth: { token: 'sk_live_YOUR_API_KEY' }
}`});

socket.<span className="text-primary">emit</span>(<span className="text-emerald-500">'subscribe'</span>, {`{ channel: 'notifications' }`});

socket.<span className="text-primary">on</span>(<span className="text-emerald-500">'message'</span>, (data) {`=>`} {`{
  if (data.channel === 'notifications') {
    console.log('New message:', data);
  }
}`});
          </div>
        </Card>

        <Card className="bg-white hover:shadow-apple-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-[22px] font-semibold text-foreground">3. Broadcast Events (Backend)</h2>
          </div>
          <p className="text-[15px] text-muted mb-4">
            Use our secure REST API to broadcast events to your channels from your backend.
          </p>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 font-mono text-[14px] text-foreground overflow-x-auto whitespace-pre">
<span className="text-pink-500">const</span> response = <span className="text-pink-500">await</span> fetch(<span className="text-emerald-500">'{apiUrl}/api/event/notifications'</span>, {`{
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'payment_success',
    data: { amount: 50 },
    user_id: 'user_123'
  })
}`});
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
