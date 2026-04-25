import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { BookOpen, Code, Terminal } from "lucide-react";

export function Docs() {
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
            SocketFlow provides a lightweight, typed client for connecting to your channels.
          </p>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 font-mono text-[14px] text-foreground">
            <span className="text-primary">npm</span> install @socketflow/client
          </div>
        </Card>

        <Card className="bg-white hover:shadow-apple-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="text-[22px] font-semibold text-foreground">2. Initialize and Subscribe</h2>
          </div>
          <p className="text-[15px] text-muted mb-4">
            Import the client, authenticate with your secret key, and subscribe to a channel.
          </p>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-4 font-mono text-[14px] text-foreground overflow-x-auto whitespace-pre">
<span className="text-pink-500">import</span> {`{ SocketFlowClient }`} <span className="text-pink-500">from</span> <span className="text-emerald-500">'@socketflow/client'</span>;

<span className="text-pink-500">const</span> client = <span className="text-pink-500">new</span> SocketFlowClient({`{
  url: 'wss://api.socketflow.io',
  token: 'sk_live_your_token_here'
}`});

client.<span className="text-primary">subscribe</span>(<span className="text-emerald-500">'notifications'</span>, (message) {`=>`} {`{
  console.log('New message:', message);
}`});
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
