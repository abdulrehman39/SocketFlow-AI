import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, Key, Hash, Bot, Book, User, Orbit, LogOut } from "lucide-react";
import { cn } from "./ui/Button";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Activity },
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
    { name: "Channels", href: "/dashboard/channels", icon: Hash },
    { name: "AI Assistant", href: "/dashboard/ai", icon: Bot },
    { name: "Documentation", href: "/docs", icon: Book },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* iPadOS Style Sidebar */}
      <aside className="w-[280px] flex flex-col p-4 bg-transparent shrink-0">
        <div className="px-4 py-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md text-white">
              <Orbit className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">SocketFlow</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href) && (item.href !== "/dashboard" || location.pathname === "/dashboard");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted hover:text-foreground hover:bg-[#e8e8ed]"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-muted")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile Footer */}
        <div className="p-2 mt-auto">
          <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-white shadow-sm border border-[#e5e5ea]">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-muted">
                  <User className="w-4 h-4" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[14px] font-medium text-foreground">Steve Jobs</span>
                 <Link to="/dashboard/profile" className="text-[12px] text-primary hover:underline">View Profile</Link>
               </div>
             </div>
             <button 
               onClick={() => navigate("/login")}
               className="p-2 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-50 transition-colors"
               title="Sign Out"
             >
               <LogOut className="w-[18px] h-[18px]" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - White rounded container */}
      <main className="flex-1 flex flex-col bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden my-4 mr-4 ml-1 border border-[#e5e5ea]/50">
        <div className="flex-1 overflow-auto p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
