import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Anchor, Coins, Shield, ChevronDown, ChevronRight, Loader2, Ship as ShipIcon, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminShipItem {
  id: string;
  name: string;
  quantity: number;
}

interface AdminShip {
  code: string;
  name: string;
  maxHull: number;
  currentHull: number;
  treasury: number;
  items: AdminShipItem[];
  updatedAt: string;
}

async function fetchShips(): Promise<AdminShip[]> {
  const res = await fetch("/api/admin/ships", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatBerries(n: number) {
  return `฿ ${n.toLocaleString("pt-BR")}`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminShipsPanel() {
  const { data: ships, isLoading, error } = useQuery({
    queryKey: ["admin-ships"],
    queryFn: fetchShips,
    refetchInterval: 8000,
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (code: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShipIcon className="w-5 h-5 text-primary" />
          Frota da Tripulação ({ships?.length ?? 0})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Todos os navios criados. Toque em um navio para ver o que tem no Baú do Bando.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive py-8 text-center">
            Erro ao carregar navios.
          </p>
        )}
        {ships && ships.length === 0 && (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Anchor className="w-12 h-12 opacity-20" />
            <p className="text-sm">Nenhum navio foi registrado ainda.</p>
            <p className="text-xs opacity-60">Quando os jogadores entrarem em um navio, ele aparece aqui.</p>
          </div>
        )}
        <div className="space-y-3">
          {ships?.map((ship) => {
            const isOpen = expanded.has(ship.code);
            const hullPct = Math.max(0, Math.min(100, (ship.currentHull / (ship.maxHull || 1)) * 100));
            const items = Array.isArray(ship.items) ? ship.items : [];
            return (
              <div
                key={ship.code}
                className="border border-border rounded-xl overflow-hidden bg-secondary/30"
              >
                <button
                  onClick={() => toggle(ship.code)}
                  className="w-full p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors text-left"
                  data-testid={`button-ship-${ship.code}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Anchor className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">{ship.name || "Sem nome"}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate">{ship.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block min-w-[90px]">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center justify-end gap-1">
                        <Shield className="w-3 h-3" /> Casco
                      </div>
                      <div className="text-sm font-bold text-orange-300">
                        {ship.currentHull}/{ship.maxHull}
                      </div>
                      <div className="h-1 w-full rounded bg-black/40 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-700 to-orange-400"
                          style={{ width: `${hullPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center justify-end gap-1">
                        <Coins className="w-3 h-3" /> Tesouro
                      </div>
                      <div className="text-sm font-bold text-primary">{formatBerries(ship.treasury)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center justify-end gap-1">
                        <Package className="w-3 h-3" /> Itens
                      </div>
                      <div className="text-sm font-bold text-foreground">{items.length}</div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border bg-background/50"
                    >
                      <div className="p-4 space-y-3">
                        {/* Mobile-only summary cards */}
                        <div className="grid grid-cols-3 gap-2 sm:hidden">
                          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                            <div className="text-[10px] text-muted-foreground uppercase">Casco</div>
                            <div className="text-sm font-bold text-orange-300">{ship.currentHull}/{ship.maxHull}</div>
                          </div>
                          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                            <div className="text-[10px] text-muted-foreground uppercase">Tesouro</div>
                            <div className="text-sm font-bold text-primary">{formatBerries(ship.treasury)}</div>
                          </div>
                          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                            <div className="text-[10px] text-muted-foreground uppercase">Atualizado</div>
                            <div className="text-xs font-bold text-foreground">{formatDate(ship.updatedAt)}</div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground hidden sm:block">
                          Última atualização: <span className="text-foreground">{formatDate(ship.updatedAt)}</span>
                        </div>

                        {items.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            Baú vazio.
                          </div>
                        ) : (
                          <div className="rounded-lg border border-border overflow-hidden divide-y divide-border/50">
                            {items.map(item => (
                              <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-background/50">
                                <span className="font-semibold text-foreground">{item.name}</span>
                                <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 border border-border text-muted-foreground">
                                  Qtd: {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
