import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Crown, Users, Skull, ChevronRight, Pencil, Ship as ShipIcon } from "lucide-react";
import type { AdminUserEntry } from "@workspace/api-client-react";
import AdminShipsPanel from "./AdminShipsPanel";
import { cn } from "@/lib/utils";

async function fetchUsers(): Promise<AdminUserEntry[]> {
  const res = await fetch("/api/admin/users", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function CrewPanel() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
    refetchInterval: 8000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Tripulação ({users?.length ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground py-8 text-center">Carregando piratas…</p>
        )}
        {error && (
          <p className="text-sm text-destructive py-8 text-center">
            Erro ao carregar lista de usuários.
          </p>
        )}
        {users && users.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum pirata se conectou ainda.
          </p>
        )}
        <div className="grid gap-3">
          {users?.map((u) => (
            <Link key={u.id} href={`/almirante/${u.id}`}>
              <button className="w-full group flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:border-primary/60 hover:bg-secondary/60 transition-all text-left">
                <div className="flex items-center gap-4 min-w-0">
                  {u.profileImageUrl ? (
                    <img
                      src={u.profileImageUrl}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
                      <Skull className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">
                        {u.pirateName || u.firstName || u.email || "Pirata sem nome"}
                      </span>
                      {u.role === "mestre" && (
                        <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded">
                          mestre
                        </span>
                      )}
                      {!u.hasCharacter && (
                        <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          sem ficha
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">XP</div>
                    <div className="text-base font-bold text-primary">{u.xpTotal ?? "—"}</div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Bounty</div>
                    <div className="text-base font-bold text-amber-400">
                      {typeof u.bounty === "number" ? `฿${u.bounty.toLocaleString("pt-BR")}` : "—"}
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-1 text-xs text-primary font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100">
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type Tab = "crew" | "ships";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("crew");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Crown className="w-7 h-7 text-primary" />
            Painel do Almirante
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Toque em qualquer pirata para abrir a ficha completa, ou inspecione os navios e seus baús.
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { value: "crew" as Tab, label: "Tripulação", icon: Users },
          { value: "ships" as Tab, label: "Navios", icon: ShipIcon },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all border-b-2 -mb-px",
              tab === t.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            data-testid={`tab-admin-${t.value}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "crew" && <CrewPanel />}
      {tab === "ships" && <AdminShipsPanel />}
    </div>
  );
}
