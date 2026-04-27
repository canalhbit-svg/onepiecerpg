import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Crown, Users, Skull, ScrollText, Star, ChevronRight, Anchor, X } from "lucide-react";
import type { AdminUserEntry, Character } from "@workspace/api-client-react";

async function fetchUsers(): Promise<AdminUserEntry[]> {
  const res = await fetch("/api/admin/users", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchCharacter(userId: string): Promise<Character | null> {
  const res = await fetch(`/api/admin/character/${userId}`, { credentials: "include" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminPage() {
  const [selected, setSelected] = useState<AdminUserEntry | null>(null);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
    refetchInterval: 8000,
  });

  const { data: character } = useQuery({
    queryKey: ["admin-character", selected?.id],
    queryFn: () => fetchCharacter(selected!.id),
    enabled: !!selected,
    refetchInterval: 5000,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Crown className="w-7 h-7 text-primary" />
            Painel do Almirante
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Vista geral de todos os piratas da sua tripulação.
          </p>
        </CardHeader>
      </Card>

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
              <button
                key={u.id}
                onClick={() => setSelected(u)}
                className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:border-primary/60 hover:bg-secondary/60 transition-all text-left"
              >
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
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ScrollText className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">
                  {selected.pirateName || selected.firstName || selected.email}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!character && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Este pirata ainda não criou ficha.
                </p>
              )}
              {character && <CharacterSummary character={character} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CharacterSummary({ character }: { character: Character }) {
  const df = character.devilFruit as { name?: string; type?: string; mastery?: number; active?: boolean } | null;
  const haki = character.haki as Record<string, boolean> | null;
  const hakiUnlocked = haki
    ? Object.entries(haki)
        .filter(([k, v]) => k.endsWith("Unlocked") && v)
        .map(([k]) => k.replace("Unlocked", ""))
    : [];

  return (
    <div className="space-y-5">
      <Field label="Nome do Jogador" value={character.playerName || "—"} />
      <Field label="Pirata" value={character.pirateName || "—"} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Origem" value={character.origin || "—"} />
        <Field label="Especialidade" value={character.specialty || "—"} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="XP Total" value={character.xpTotal} icon={<Star className="w-4 h-4" />} />
        <Stat label="Bounty" value={character.bounty ?? 0} icon={<Anchor className="w-4 h-4" />} />
        <Stat label="Vigor" value={(character.vigor as { value?: number })?.value ?? 0} icon={<Skull className="w-4 h-4" />} />
      </div>

      {df?.active && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-700/40">
          <div className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">
            Akuma no Mi
          </div>
          <div className="font-bold text-foreground">{df.name || "Sem nome"}</div>
          <div className="text-xs text-muted-foreground">
            {df.type} · Maestria {df.mastery ?? 0}%
          </div>
        </div>
      )}

      {hakiUnlocked.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/40">
          <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">
            Haki Desbloqueado
          </div>
          <div className="flex flex-wrap gap-2">
            {hakiUnlocked.map((h) => (
              <span key={h} className="text-xs px-2 py-1 rounded bg-amber-900/40 text-amber-200">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground italic text-center pt-2">
        Atualizado em {new Date(character.updatedAt).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        {label}
      </div>
      <div className="font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-secondary/40 rounded-xl p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
    </div>
  );
}
