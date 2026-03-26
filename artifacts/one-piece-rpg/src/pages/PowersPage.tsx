import { useState } from "react";
import { useGetCharacter, useSaveCharacter, type CharacterInput } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Flame, Eye, Crown, Zap, Shield, Wind, AlertTriangle, CheckCircle } from "lucide-react";
import {
  AKUMA_NO_MI, FRUIT_TYPE_COLORS, HAKI_LIST,
  type AkumaNoMi, type HakiId,
} from "@/lib/powers-data";

const DEFAULT_HAKI = {
  armamentoUnlocked: false,
  observacaoUnlocked: false,
  haoshokuUnlocked: false,
  armamentoActive: false,
  observacaoActive: false,
  haoshokuActive: false,
};

const DEFAULT_DEVIL_FRUIT = {
  active: false,
  fruitId: undefined as string | undefined,
  type: undefined as "Paramecia" | "Zoan" | "Logia" | undefined,
  name: undefined as string | undefined,
  mastery: 0,
  moves: [
    { name: "", damage: "", description: "" },
    { name: "", damage: "", description: "" },
    { name: "", damage: "", description: "" },
  ],
};

function StaminaBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const color = pct > 50 ? "from-blue-700 to-blue-400" : pct > 20 ? "from-yellow-700 to-yellow-400" : "from-red-800 to-red-500";
  return (
    <div className="relative h-6 bg-secondary rounded-full overflow-hidden border border-border shadow-inner">
      <div
        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">
        {current} / {max} Stamina
      </div>
    </div>
  );
}

export default function PowersPage() {
  const { data: character, isLoading, refetch } = useGetCharacter({ query: { retry: false } });
  const saveMutation = useSaveCharacter();

  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<"Todos" | "Zoan" | "Paramecia" | "Logia">("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const save = (updates: Partial<CharacterInput>) => {
    if (!character) return;
    setSaving(true);
    saveMutation.mutate(
      { data: { ...character, ...updates, xpLog: character.xpLog ?? [], inventory: character.inventory ?? [] } },
      {
        onSuccess: () => { refetch(); setSaving(false); showToast("ok", "Salvo!"); },
        onError:   () => { setSaving(false); showToast("err", "Erro ao salvar."); },
      }
    );
  };

  if (isLoading || !character) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const df = (character.devilFruit as typeof DEFAULT_DEVIL_FRUIT | null) ?? { ...DEFAULT_DEVIL_FRUIT };
  const haki = (character.haki as typeof DEFAULT_HAKI | null) ?? { ...DEFAULT_HAKI };
  const currentStamina = character.currentStamina ?? 0;
  const maxStamina = (character.vigor?.value ?? 0) * 10;
  const isExhausted = currentStamina <= 0 && maxStamina > 0;

  const selectedFruit: AkumaNoMi | undefined = AKUMA_NO_MI.find(f => f.id === df.fruitId);

  // ── handlers ────────────────────────────────────────────────────
  const handleSelectFruit = (fruit: AkumaNoMi) => {
    save({
      devilFruit: {
        ...df,
        active: true,
        fruitId: fruit.id,
        type: fruit.type,
        name: fruit.name,
        mastery: df.mastery ?? 0,
        moves: df.moves ?? [],
      } as CharacterInput["devilFruit"],
    });
  };

  const handleRemoveFruit = () => {
    save({ devilFruit: { ...DEFAULT_DEVIL_FRUIT, active: false } as CharacterInput["devilFruit"] });
  };

  const handleMastery = (v: number) => {
    save({ devilFruit: { ...df, mastery: Math.max(0, Math.min(100, v)) } as CharacterInput["devilFruit"] });
  };

  const handleMove = (idx: number, field: "name" | "damage" | "description", val: string) => {
    const moves = [...(df.moves ?? [{ name: "", damage: "", description: "" }, { name: "", damage: "", description: "" }, { name: "", damage: "", description: "" }])];
    while (moves.length < 3) moves.push({ name: "", damage: "", description: "" });
    moves[idx] = { ...moves[idx], [field]: val };
    save({ devilFruit: { ...df, moves } as CharacterInput["devilFruit"] });
  };

  const handleHaki = (key: keyof typeof DEFAULT_HAKI, val: boolean) => {
    save({ haki: { ...haki, [key]: val } as CharacterInput["haki"] });
  };

  const handleStamina = (delta: number) => {
    const next = Math.max(0, Math.min(maxStamina, currentStamina + delta));
    save({ currentStamina: next });
  };

  const handleRest = (full: boolean) => {
    const inventory: import("@workspace/api-client-react").InventoryItem[] = Array.isArray(character.inventory) ? character.inventory : [];
    if (!full) {
      // Short rest - consume 1 provisão
      const idx = inventory.findIndex(i => i.name.toLowerCase().includes("ração") || i.name.toLowerCase().includes("provisão") || i.name.toLowerCase().includes("provisoes"));
      let newInv = [...inventory];
      if (idx !== -1) {
        if (newInv[idx].quantity > 1) newInv[idx] = { ...newInv[idx], quantity: newInv[idx].quantity - 1 };
        else newInv.splice(idx, 1);
        save({ currentStamina: Math.min(maxStamina, currentStamina + 20), inventory: newInv });
        showToast("ok", "+20 Stamina (Refeição). 1 Provisão consumida.");
      } else {
        showToast("err", "Sem Provisões na mochila!");
      }
    } else {
      save({ currentStamina: maxStamina });
      showToast("ok", "Stamina totalmente recuperada (Descanso Longo).");
    }
  };

  const handleUseHakiArmamento = () => {
    if (currentStamina < 5) { showToast("err", "Stamina insuficiente!"); return; }
    save({ currentStamina: currentStamina - 5 });
    showToast("ok", "Haki de Armamento ativado! -5 Stamina. +1d6 dano neste ataque.");
  };

  const handleImporPresenca = () => {
    if (currentStamina < 50) { showToast("err", "Stamina insuficiente (custo: 50)!"); return; }
    const roll = Math.floor(Math.random() * 20) + 1;
    save({ currentStamina: currentStamina - 50 });
    showToast("ok", `Presença imposta! Rolagem: ${roll} (Espírito vs Vigor). -50 Stamina.`);
  };

  const handleUseFruitMove = () => {
    if (currentStamina < 10) { showToast("err", "Stamina insuficiente (custo: 10)!"); return; }
    save({ currentStamina: currentStamina - 10 });
    showToast("ok", "Golpe da Fruta usado! -10 Stamina.");
  };

  const filteredFruits = AKUMA_NO_MI.filter(f => {
    const typeMatch = filterType === "Todos" || f.type === filterType;
    const search = searchTerm.toLowerCase();
    const nameMatch = !search || f.name.toLowerCase().includes(search);
    return typeMatch && nameMatch;
  });

  const moves = df.moves ?? [{ name: "", damage: "", description: "" }, { name: "", damage: "", description: "" }, { name: "", damage: "", description: "" }];
  while (moves.length < 3) (moves as { name: string; damage: string; description: string }[]).push({ name: "", damage: "", description: "" });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border font-semibold shadow-xl ${
              toast.type === "ok"
                ? "bg-green-950/90 border-green-600 text-green-300"
                : "bg-red-950/90 border-red-600 text-red-300"
            }`}
          >
            {toast.type === "ok" ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STAMINA BAR ───────────────────────────────────────────── */}
      <Card className={isExhausted ? "border-red-600" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <CardTitle>Stamina</CardTitle>
              {isExhausted && (
                <span className="text-xs text-red-400 font-bold border border-red-600 rounded px-2 py-0.5">
                  ⚠ EXAUSTÃO: -5 em todos os atributos
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Máx = Vigor × 10</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <StaminaBar current={currentStamina} max={maxStamina} />

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="text-red-400 border-red-700/40" onClick={() => handleStamina(-5)}>-5</Button>
            <Button variant="outline" size="sm" className="text-red-400 border-red-700/40" onClick={() => handleStamina(-10)}>-10</Button>
            <Button variant="outline" size="sm" className="text-red-400 border-red-700/40" onClick={() => handleStamina(-50)}>-50</Button>
            <Button variant="outline" size="sm" className="text-green-400 border-green-700/40" onClick={() => handleStamina(10)}>+10</Button>
            <Button variant="outline" size="sm" className="text-green-400 border-green-700/40" onClick={() => handleStamina(20)}>+20</Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-700/40" onClick={() => handleRest(false)}>
              🍖 Descanso Curto (+20, usa Provisão)
            </Button>
            <Button variant="gold" size="sm" onClick={() => handleRest(true)}>
              💤 Descanso Longo (100%)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── AKUMA NO MI ───────────────────────────────────────────── */}
      <Card className={df.active && selectedFruit ? FRUIT_TYPE_COLORS[selectedFruit.type].border : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              <CardTitle>Akuma no Mi</CardTitle>
              {df.active && selectedFruit && (
                <span className={`text-xs font-bold border rounded px-2 py-0.5 ${FRUIT_TYPE_COLORS[selectedFruit.type].badge}`}>
                  {selectedFruit.type}
                </span>
              )}
            </div>
            {df.active && (
              <Button variant="outline" size="sm" className="text-red-400 border-red-700/40" onClick={handleRemoveFruit}>
                Remover Fruta
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Active fruit info */}
          {df.active && selectedFruit ? (
            <div className={`rounded-xl p-4 border space-y-3 ${FRUIT_TYPE_COLORS[selectedFruit.type].bg} ${FRUIT_TYPE_COLORS[selectedFruit.type].border}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`font-bold text-lg ${FRUIT_TYPE_COLORS[selectedFruit.type].text}`}>{selectedFruit.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedFruit.description}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground">Ataque Base</div>
                  <div className="font-mono font-bold text-yellow-400">{selectedFruit.baseDamage}</div>
                </div>
              </div>

              {/* Sea weakness */}
              <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-700/40 rounded-lg px-3 py-2">
                <span>🌊</span>
                <span className="text-sm text-blue-300 font-semibold">Fraqueza ao Mar: -1d10 em testes de natação</span>
              </div>

              {/* Passive effect */}
              <div className="bg-black/30 border border-border rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Efeito Passivo</p>
                <p className="text-sm text-foreground">{selectedFruit.passiveEffect}</p>
              </div>

              {/* Mastery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Nível de Maestria</p>
                  <span className="font-bold text-primary">{df.mastery ?? 0}%</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={df.mastery ?? 0}
                    onChange={e => handleMastery(parseInt(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-xs border-border" onClick={() => handleMastery((df.mastery ?? 0) - 5)}>-5</Button>
                    <Button size="sm" variant="outline" className="text-xs border-primary/40 text-primary" onClick={() => handleMastery((df.mastery ?? 0) + 5)}>+5</Button>
                  </div>
                </div>
              </div>

              {/* Use fruit move button */}
              <Button
                variant="gold"
                className="w-full"
                disabled={currentStamina < 10}
                onClick={handleUseFruitMove}
              >
                <Flame className="w-4 h-4 mr-2" />
                Usar Golpe da Fruta (-10 Stamina)
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhuma Akuma no Mi selecionada. Escolha uma fruta abaixo.
            </div>
          )}

          {/* Fruit selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="Buscar fruta..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 min-w-40"
              />
              {(["Todos", "Zoan", "Paramecia", "Logia"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredFruits.map(fruit => {
                const tc = FRUIT_TYPE_COLORS[fruit.type];
                const isSelected = df.fruitId === fruit.id;
                return (
                  <button
                    key={fruit.id}
                    onClick={() => handleSelectFruit(fruit)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected ? `${tc.border} ${tc.bg} ring-1 ring-offset-0 ring-primary` : "border-border bg-background/50 hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold border rounded px-1.5 py-0.5 ${tc.badge}`}>{fruit.type}</span>
                      <span className="text-xs text-muted-foreground">{fruit.rarity}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-1 leading-tight">{fruit.name}</p>
                    <p className="text-xs font-mono text-yellow-400 mt-0.5">{fruit.baseDamage}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom moves */}
          {df.active && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">⚡ Golpes Personalizados</p>
              {([0, 1, 2] as const).map(i => (
                <div key={i} className="border border-border rounded-xl p-3 space-y-2 bg-background/40">
                  <p className="text-xs text-muted-foreground font-bold">Golpe {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={`Nome (ex: Gomu Gomu no Pistol)`}
                      value={moves[i]?.name ?? ""}
                      onChange={e => handleMove(i, "name", e.target.value)}
                      className="col-span-2"
                    />
                    <Input
                      placeholder="Dano (ex: 1d12)"
                      value={moves[i]?.damage ?? ""}
                      onChange={e => handleMove(i, "damage", e.target.value)}
                    />
                    <Input
                      placeholder="Descrição"
                      value={moves[i]?.description ?? ""}
                      onChange={e => handleMove(i, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── HAKI ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <CardTitle>Haki</CardTitle>
            <span className="text-xs text-muted-foreground">(Desbloqueado pelo Mestre)</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {HAKI_LIST.map(h => {
            const unlockedKey = `${h.id}Unlocked` as keyof typeof DEFAULT_HAKI;
            const activeKey   = `${h.id}Active`   as keyof typeof DEFAULT_HAKI;
            const isUnlocked  = haki[unlockedKey];
            const isActive    = haki[activeKey];

            return (
              <div
                key={h.id}
                className={`rounded-xl border p-4 space-y-3 transition-all ${
                  isUnlocked ? (isActive ? h.activeColor : h.color) : "border-border/30 bg-background/20 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{h.icon}</span>
                    <div>
                      <p className={`font-bold ${isUnlocked ? h.textColor : "text-muted-foreground"}`}>
                        {h.name}
                      </p>
                      <p className="text-xs text-muted-foreground italic">{h.subtitle}</p>
                    </div>
                  </div>

                  {/* GM unlock toggle */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Mestre</p>
                      <div
                        onClick={() => handleHaki(unlockedKey, !isUnlocked)}
                        className={`w-10 h-5 rounded-full cursor-pointer flex items-center px-1 transition-colors ${isUnlocked ? "bg-green-600" : "bg-gray-700"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isUnlocked ? "translate-x-5" : "translate-x-0"}`} />
                      </div>
                    </div>

                    {isUnlocked && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Ativo</p>
                        <div
                          onClick={() => handleHaki(activeKey, !isActive)}
                          className={`w-10 h-5 rounded-full cursor-pointer flex items-center px-1 transition-colors ${isActive ? "bg-primary" : "bg-gray-700"}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{h.description}</p>

                {isUnlocked && (
                  <div className="bg-black/30 border border-border/60 rounded-lg px-3 py-2">
                    <p className="text-xs text-yellow-400 font-bold">{h.bonus}</p>
                    <p className="text-xs text-muted-foreground mt-1">Custo: {h.staminaCost} Stamina por uso</p>
                  </div>
                )}

                {/* Action buttons */}
                {isUnlocked && isActive && (
                  <div>
                    {h.id === "armamento" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-500/60 text-gray-300 hover:bg-gray-800/40"
                        disabled={currentStamina < 5 || isExhausted}
                        onClick={handleUseHakiArmamento}
                      >
                        <Shield className="w-4 h-4 mr-2" /> Ativar Armamento (-5 Stamina)
                      </Button>
                    )}
                    {h.id === "observacao" && (
                      <div className="flex items-center gap-2 bg-blue-950/30 border border-blue-700/40 rounded-lg px-3 py-2">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-semibold">Prever Movimentos ativo — +4 Agilidade/Esquiva</span>
                      </div>
                    )}
                    {h.id === "haoshoku" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-600/60 text-yellow-300 hover:bg-yellow-950/30"
                        disabled={currentStamina < 50 || isExhausted}
                        onClick={handleImporPresenca}
                      >
                        <Crown className="w-4 h-4 mr-2" /> Impor Presença (-50 Stamina)
                      </Button>
                    )}
                  </div>
                )}

                {!isUnlocked && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wind className="w-3 h-3" /> Aguardando liberação do Mestre...
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {saving && (
        <div className="fixed bottom-24 right-4 bg-black/80 border border-primary/50 text-primary px-4 py-2 rounded-full flex items-center gap-2 z-50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-bold">Salvando...</span>
        </div>
      )}
    </div>
  );
}
