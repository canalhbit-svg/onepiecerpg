import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ScrollText, Flame, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CharacterSheet from "./CharacterSheet";
import PowersPage from "./PowersPage";

interface AdminUserMeta {
  id: string;
  email: string | null;
  pirateName: string | null;
  firstName: string | null;
}

async function fetchUserMeta(userId: string): Promise<AdminUserMeta | null> {
  const res = await fetch("/api/admin/users", { credentials: "include" });
  if (!res.ok) return null;
  const list: AdminUserMeta[] = await res.json();
  return list.find((u) => u.id === userId) ?? null;
}

export default function AdminEditPage() {
  const [, params] = useRoute("/almirante/:userId");
  const userId = params?.userId;
  const [tab, setTab] = useState<"sheet" | "powers">("sheet");

  const { data: meta, isLoading } = useQuery({
    queryKey: ["admin-user-meta", userId],
    queryFn: () => fetchUserMeta(userId!),
    enabled: !!userId,
  });

  if (!userId) {
    return (
      <div className="text-center text-muted-foreground py-20">
        Pirata não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/almirante">
          <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel
          </button>
        </Link>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full border border-primary/30">
          <Crown className="w-4 h-4" />
          Modo Almirante
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/15 to-background border border-primary/40 rounded-2xl p-5 shadow-lg shadow-primary/10">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando pirata…
          </div>
        )}
        {!isLoading && meta && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-1">
              Editando ficha de
            </div>
            <h1 className="font-display font-bold text-3xl text-primary text-glow">
              {meta.pirateName || meta.firstName || meta.email || "Pirata"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">{meta.email}</p>
          </>
        )}
        {!isLoading && !meta && (
          <p className="text-sm text-muted-foreground">Pirata não encontrado.</p>
        )}
      </div>

      <div className="flex gap-2 border-b border-border">
        <TabButton active={tab === "sheet"} onClick={() => setTab("sheet")} icon={<ScrollText className="w-4 h-4" />}>
          Ficha
        </TabButton>
        <TabButton active={tab === "powers"} onClick={() => setTab("powers")} icon={<Flame className="w-4 h-4" />}>
          Poderes (XP, Haki, Akuma)
        </TabButton>
      </div>

      <div>
        {tab === "sheet" && <CharacterSheet targetUserId={userId} />}
        {tab === "powers" && <PowersPage targetUserId={userId} />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px",
        active
          ? "text-primary border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
