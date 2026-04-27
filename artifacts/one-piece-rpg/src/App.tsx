import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CharacterSheet from "@/pages/CharacterSheet";
import ShipSheet from "@/pages/ShipSheet";
import MarketPage from "@/pages/MarketPage";
import PowersPage from "@/pages/PowersPage";
import AdminPage from "@/pages/AdminPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import { ScrollText, Ship as ShipIcon, ShoppingBag, Flame, Crown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { isMasterUser } from "@/lib/auth";

const queryClient = new QueryClient();

function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isMaster = isMasterUser(user);

  const tabs = [
    { href: "/", label: "PERSONAGEM", icon: ScrollText },
    { href: "/ship", label: "O NAVIO", icon: ShipIcon },
    { href: "/market", label: "MERCADO", icon: ShoppingBag },
    { href: "/powers", label: "PODERES", icon: Flame },
    ...(isMaster ? [{ href: "/almirante", label: "ALMIRANTE", icon: Crown }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border shadow-xl shadow-black/50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <img src={`${import.meta.env.BASE_URL}images/skull-logo.png`} alt="Jolly Roger" className="w-10 h-10 object-contain drop-shadow-md flex-shrink-0" />
          <h1 className="font-display font-bold text-xl tracking-widest text-primary text-glow hidden md:block">ONE PIECE RPG</h1>
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                location === href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen relative font-sans">
      <img
        src={`${import.meta.env.BASE_URL}images/bg-texture.png`}
        alt="Background texture"
        className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0 mix-blend-overlay"
      />

      <Navigation />

      <main className="relative z-10 p-4 sm:p-6 lg:p-8">
        <Switch>
          <Route path="/" component={CharacterSheet} />
          <Route path="/ship" component={ShipSheet} />
          <Route path="/market" component={MarketPage} />
          <Route path="/powers" component={PowersPage} />
          <Route path="/almirante" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function AuthGate() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}images/skull-logo.png`}
            alt=""
            className="w-16 h-16 object-contain animate-pulse"
          />
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Içando velas…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthGate />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
