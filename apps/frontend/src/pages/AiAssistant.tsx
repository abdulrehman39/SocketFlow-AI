import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Bot, Send, Code, Sparkles, User as UserIcon } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I have full context of your current implementation. How can I help you today? You can ask me to generate a React Hook for subscribing to a channel or debug why your Node.js backend is failing to authenticate."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiUrl = import.meta.env.VITE_AI_URL || "http://localhost:3002";
      const response = await fetch(`${aiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages // Send previous context
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Agent");
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Sorry, I'm having trouble connecting to the AI backend. Please ensure the agent service is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col space-y-6"
    >
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-foreground flex items-center gap-3">
          <Bot className="w-9 h-9 text-primary" />
          RAG AI Assistant
        </h1>
        <p className="text-[17px] text-muted mt-1">Ask questions, debug connection issues, or generate SDK snippets tailored to your stack.</p>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-border/50 min-h-[500px] bg-white shadow-apple-lg">
        {/* Chat Area */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-white border-[#e5e5ea] text-muted'
              }`}>
                {msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
              </div>
              <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <p className="text-foreground font-semibold text-[15px]">
                  {msg.role === 'assistant' ? 'SocketFlow AI' : 'You'}
                </p>
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'assistant'
                    ? 'bg-white border border-[#e5e5ea] text-[#1d1d1f] rounded-tl-none'
                    : 'bg-primary text-white rounded-tr-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2 max-w-[80%]">
                <p className="text-foreground font-semibold text-[15px]">SocketFlow AI</p>
                <div className="bg-white border border-[#e5e5ea] p-5 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-[#e5e5ea]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <Button type="button" variant="secondary" className="px-3.5 rounded-xl border-[#d2d2d7]">
              <Code className="w-5 h-5 text-muted" />
            </Button>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your integration..." 
              className="bg-[#f5f5f7] border-transparent"
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" className="px-5 rounded-xl" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}
