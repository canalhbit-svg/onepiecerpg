import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { LogIn, Skull } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen relative font-sans flex items-center justify-center p-6 overflow-hidden">
      <img
        src={`${import.meta.env.BASE_URL}images/bg-texture.png`}
        alt=""
        className="fixed inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black/80 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md text-center space-y-8"
      >
        <motion.div
          animate={{ rotate: [0, -3, 3, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/skull-logo.png`}
            alt="Jolly Roger"
            className="w-40 h-40 object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]"
          />
        </motion.div>

        <div className="space-y-3">
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-widest text-primary text-glow">
            ONE PIECE
          </h1>
          <p className="font-display text-lg tracking-[0.3em] text-muted-foreground uppercase">
            RPG · Ficha de Pirata
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-base text-foreground/80 italic">
            "Eu vou me tornar… o Rei dos Piratas!"
          </p>
          <p className="text-sm text-muted-foreground">
            Entre para acessar sua ficha. Cada pirata navega com a sua própria conta.
          </p>
        </div>

        <button
          onClick={login}
          className="group w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.99]"
        >
          <LogIn className="w-5 h-5" />
          <span>Entrar e Levantar Âncora</span>
        </button>

        <div className="pt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
          <Skull className="w-3 h-3" />
          <span>Use sua conta Google ou Replit</span>
          <Skull className="w-3 h-3" />
        </div>
      </motion.div>
    </div>
  );
}
