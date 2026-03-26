import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword, Backpack, Trash2, Plus, Zap, ShieldCheck,
  FlaskConical, Wrench, Package, Pencil, X, Check, Crown, Star
} from "lucide-react";
import type { CharacterInput, InventoryItem } from "@workspace/api-client-react";
import { generateId } from "@/lib/utils";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

type RarityKey = "comum" | "raro" | "epico" | "lendario";

const RARITY_CONFIG: Record<RarityKey, {
  label: string;
  border: string;
  bg: string;
  badge: string;
  icon: React.ReactNode;
}> = {
  comum:    { label: "Comum",    border: "border-border",       bg: "bg-background/50",    badge: "text-muted-foreground bg-black/30 border-border",            icon: null },
  raro:     { label: "Raro",     border: "border-blue-700/60",  bg: "bg-blue-950/10",      badge: "text-blue-400 bg-blue-950/40 border-blue-700/40",            icon: <Star className="w-3 h-3" /> },
  epico:    { label: "Épico",    border: "border-purple-600/60",bg: "bg-purple-950/10",    badge: "text-purple-400 bg-purple-950/40 border-purple-700/40",      icon: <Star className="w-3 h-3" /> },
  lendario: { label: "Lendário", border: "border-yellow-500/80",bg: "bg-yellow-950/15",    badge: "text-yellow-300 bg-yellow-950/50 border-yellow-500/60",      icon: <Crown className="w-3 h-3" /> },
};

function rollDice(notation: string): { rolls: number[]; total: number } {
  const match = notation.match(/(\d+)d(\d+)/i);
  if (!match) return { rolls: [0], total: 0 };
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}

const TYPE_ICONS = {
  weapon:     <Sword className="w-4 h-4 text-red-400" />,
  consumable: <FlaskConical className="w-4 h-4 text-green-400" />,
  tool:       <Wrench className="w-4 h-4 text-blue-400" />,
};

const TYPE_LABELS = {
  weapon:     "Arma",
  consumable: "Consumível",
  tool:       "Ferramenta",
};

interface AttackResult { itemId: string; rolls: number[]; total: number }
interface UseResult    { itemId: string; roll: number; healed: number }

interface ItemFormState {
  name: string;
  type: "weapon" | "consumable" | "tool";
  damage: string;
  effect: string;
  rarity: RarityKey;
  masterGiven: boolean;
  quantity: string;
}

const emptyForm = (): ItemFormState => ({
  name: "",
  type: "weapon",
  damage: "",
  effect: "",
  rarity: "comum",
  masterGiven: false,
  quantity: "1",
});

function ItemForm({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: ItemFormState;
  onSave: (f: ItemFormState) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState<ItemFormState>(initial);
  const set = <K extends keyof ItemFormState>(k: K, v: ItemFormState[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-background/80 border border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>

        <div className="grid grid-cols-2 gap-3">
          {/* Name */}
          <Input
            placeholder="Nome do Item (ex: Wado Ichimonji)"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            className="col-span-2"
          />

          {/* Type */}
          <select
            value={form.type}
            onChange={e => set("type", e.target.value as "weapon" | "consumable" | "tool")}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          >
            <option value="weapon">⚔️ Arma</option>
            <option value="consumable">🧪 Consumível</option>
            <option value="tool">🔧 Ferramenta</option>
          </select>

          {/* Rarity */}
          <select
            value={form.rarity}
            onChange={e => set("rarity", e.target.value as RarityKey)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          >
            <option value="comum">⬜ Comum</option>
            <option value="raro">🔵 Raro</option>
            <option value="epico">🟣 Épico</option>
            <option value="lendario">🌟 Lendário / Meito</option>
          </select>

          {/* Damage / bonus */}
          <Input
            placeholder="Dano/Bônus (ex: 1d20, +5 Espírito)"
            value={form.damage}
            onChange={e => set("damage", e.target.value)}
          />

          {/* Quantity */}
          <Input
            type="number"
            placeholder="Qtd"
            min={1}
            value={form.quantity}
            onChange={e => set("quantity", e.target.value)}
          />

          {/* Description */}
          <textarea
            placeholder="Descrição / história do item..."
            value={form.effect}
            onChange={e => set("effect", e.target.value)}
            rows={2}
            className="col-span-2 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Master-given toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => set("masterGiven", !form.masterGiven)}
            className={`w-10 h-5 rounded-full transition-colors flex items-center px-1 ${
              form.masterGiven ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${form.masterGiven ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="text-sm text-muted-foreground">
            Item do Mestre{" "}
            <span className="text-xs">(não custa Berries — concedido pelo sistema)</span>
          </span>
        </label>

        <div className="flex gap-2 pt-1">
          <Button
            variant="gold"
            className="flex-1"
            onClick={() => { if (form.name.trim()) onSave(form); }}
            disabled={!form.name.trim()}
          >
            <Check className="w-4 h-4 mr-2" /> Salvar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function InventorySection({ character, onChange }: Props) {
  const [attackResult, setAttackResult] = useState<AttackResult | null>(null);
  const [useResult, setUseResult]       = useState<UseResult | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);

  const inventory: InventoryItem[] = Array.isArray(character.inventory) ? character.inventory : [];

  const updateInventory = (items: InventoryItem[]) => onChange({ inventory: items });

  const handleEquip = (itemId: string) => {
    const updated = inventory.map(item => {
      if (item.type === "weapon") {
        return { ...item, equipped: item.id === itemId ? !item.equipped : false };
      }
      return item;
    });
    updateInventory(updated);
    setAttackResult(null);
  };

  const handleRollAttack = (item: InventoryItem) => {
    if (!item.damage) return;
    const result = rollDice(item.damage);
    setAttackResult({ itemId: item.id, rolls: result.rolls, total: result.total });
    setUseResult(null);
  };

  const handleUse = (item: InventoryItem) => {
    setAttackResult(null);
    const healAmt = item.damage ? rollDice(item.damage).total : 2;
    const newHp = Math.min(character.currentHp + healAmt, character.maxHp);
    onChange({ currentHp: newHp });
    setUseResult({ itemId: item.id, roll: healAmt, healed: newHp - character.currentHp });
    const idx = inventory.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      const updated = [...inventory];
      if (updated[idx].quantity > 1) {
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
      } else {
        updated.splice(idx, 1);
      }
      updateInventory(updated);
    }
  };

  const handleRemove = (itemId: string) => {
    updateInventory(inventory.filter(i => i.id !== itemId));
    if (attackResult?.itemId === itemId) setAttackResult(null);
    if (useResult?.itemId === itemId)    setUseResult(null);
    if (editingId === itemId)            setEditingId(null);
  };

  const handleAddItem = (form: ItemFormState) => {
    const newItem: InventoryItem = {
      id: generateId(),
      name: form.name.trim(),
      type: form.type,
      damage: form.damage.trim() || undefined,
      effect: form.effect.trim() || undefined,
      quantity: Math.max(1, parseInt(form.quantity) || 1),
      equipped: false,
      rarity: form.rarity,
      masterGiven: form.masterGiven || undefined,
    };
    updateInventory([...inventory, newItem]);
    setShowAdd(false);
  };

  const handleEditItem = (form: ItemFormState, itemId: string) => {
    updateInventory(inventory.map(item =>
      item.id === itemId
        ? {
            ...item,
            name: form.name.trim(),
            type: form.type,
            damage: form.damage.trim() || undefined,
            effect: form.effect.trim() || undefined,
            quantity: Math.max(1, parseInt(form.quantity) || 1),
            rarity: form.rarity,
            masterGiven: form.masterGiven || undefined,
          }
        : item
    ));
    setEditingId(null);
  };

  const itemToForm = (item: InventoryItem): ItemFormState => ({
    name: item.name,
    type: item.type,
    damage: item.damage ?? "",
    effect: item.effect ?? "",
    rarity: (item.rarity as RarityKey) ?? "comum",
    masterGiven: item.masterGiven ?? false,
    quantity: String(item.quantity),
  });

  const equippedWeapon = inventory.find(i => i.type === "weapon" && i.equipped);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Backpack className="w-6 h-6 text-primary" />
            <CardTitle>Mochila do Pirata</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => { setShowAdd(v => !v); setEditingId(null); }}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar Item
          </Button>
        </div>

        {equippedWeapon && (
          <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 ${
            (equippedWeapon.rarity as RarityKey) === "lendario"
              ? "bg-yellow-950/30 border border-yellow-500/60"
              : "bg-red-950/40 border border-red-700/40"
          }`}>
            <ShieldCheck className={`w-4 h-4 ${(equippedWeapon.rarity as RarityKey) === "lendario" ? "text-yellow-400" : "text-red-400"}`} />
            <span className={`text-sm font-semibold ${(equippedWeapon.rarity as RarityKey) === "lendario" ? "text-yellow-300" : "text-red-300"}`}>
              Equipado: {equippedWeapon.name}
              {equippedWeapon.damage && <span className="ml-2 font-mono">({equippedWeapon.damage})</span>}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <ItemForm
              key="add-form"
              initial={emptyForm()}
              onSave={handleAddItem}
              onCancel={() => setShowAdd(false)}
              title="✨ Adicionar Item do Mestre"
            />
          )}
        </AnimatePresence>

        {/* Inventory list */}
        {inventory.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Backpack className="w-12 h-12 opacity-20" />
            <p className="text-sm">A mochila está vazia.</p>
            <p className="text-xs opacity-60">Compre no Mercado Pirata ou adicione manualmente.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {inventory.map(item => {
              const rarity = (item.rarity as RarityKey) ?? "comum";
              const rc = RARITY_CONFIG[rarity];
              const isAttacking = attackResult?.itemId === item.id;
              const isUsed      = useResult?.itemId === item.id;
              const isEditing   = editingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <ItemForm
                        key={`edit-${item.id}`}
                        initial={itemToForm(item)}
                        onSave={f => handleEditItem(f, item.id)}
                        onCancel={() => setEditingId(null)}
                        title={`✏️ Editando: ${item.name}`}
                      />
                    ) : (
                      <motion.div
                        key={`view-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border rounded-xl p-3 transition-all ${
                          item.equipped
                            ? rarity === "lendario"
                              ? "border-yellow-500/80 bg-yellow-950/20"
                              : "border-red-700/60 bg-red-950/20"
                            : `${rc.border} ${rc.bg}`
                        }`}
                      >
                        {/* Master-given glow bar */}
                        {item.masterGiven && (
                          <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-yellow-500/80 via-yellow-300/60 to-yellow-500/80 mb-2" />
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="mt-0.5">{TYPE_ICONS[item.type]}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-bold ${rarity === "lendario" ? "text-yellow-300" : "text-foreground"}`}>
                                  {item.name}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-xs bg-black/40 border border-border px-2 py-0.5 rounded font-mono text-muted-foreground">
                                    x{item.quantity}
                                  </span>
                                )}

                                {/* Rarity badge */}
                                {rarity !== "comum" && (
                                  <span className={`text-xs flex items-center gap-1 border px-2 py-0.5 rounded font-bold ${rc.badge}`}>
                                    {rc.icon} {rc.label}
                                  </span>
                                )}

                                {/* Master-given badge */}
                                {item.masterGiven && (
                                  <span className="text-xs flex items-center gap-1 text-yellow-400 bg-yellow-950/40 border border-yellow-600/40 px-2 py-0.5 rounded font-bold">
                                    <Crown className="w-3 h-3" /> Mestre
                                  </span>
                                )}

                                <span className="text-xs bg-black/30 border border-border px-2 py-0.5 rounded text-muted-foreground">
                                  {TYPE_LABELS[item.type]}
                                </span>
                                {item.damage && (
                                  <span className="text-xs font-mono text-yellow-400 bg-yellow-950/40 border border-yellow-700/40 px-2 py-0.5 rounded">
                                    {item.damage}
                                  </span>
                                )}
                                {item.equipped && (
                                  <span className={`text-xs font-bold uppercase ${rarity === "lendario" ? "text-yellow-400" : "text-red-400"}`}>
                                    ⚔ Equipado
                                  </span>
                                )}
                              </div>
                              {item.effect && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.effect}</p>
                              )}

                              {/* Attack result */}
                              <AnimatePresence>
                                {isAttacking && attackResult && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-2 bg-yellow-950/40 border border-yellow-700/40 rounded-lg px-3 py-2"
                                  >
                                    <p className="text-xs text-yellow-400 font-mono">
                                      Rolagem: [{attackResult.rolls.join(", ")}]
                                    </p>
                                    <p className="text-lg font-bold text-yellow-300">
                                      Total: <span className="text-2xl text-yellow-400">{attackResult.total}</span>
                                    </p>
                                  </motion.div>
                                )}
                                {isUsed && useResult && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-2 bg-green-950/40 border border-green-700/40 rounded-lg px-3 py-2"
                                  >
                                    <p className="text-sm text-green-400 font-bold">
                                      +{useResult.roll} de Vida restaurada!
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                            {item.type === "weapon" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`text-xs ${item.equipped ? "border-red-600 text-red-400" : "border-border text-muted-foreground"}`}
                                  onClick={() => handleEquip(item.id)}
                                >
                                  {item.equipped ? "Desequipar" : "Equipar"}
                                </Button>
                                {item.damage && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-yellow-700/40 text-yellow-400 hover:bg-yellow-950/30"
                                    onClick={() => handleRollAttack(item)}
                                  >
                                    <Zap className="w-3 h-3 mr-1" /> Atacar
                                  </Button>
                                )}
                              </>
                            )}
                            {item.type === "consumable" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-green-700/40 text-green-400 hover:bg-green-950/30"
                                onClick={() => handleUse(item)}
                              >
                                <FlaskConical className="w-3 h-3 mr-1" /> Usar
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground w-7 h-7"
                              onClick={() => { setEditingId(item.id); setShowAdd(false); }}
                              title="Editar item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/20 w-7 h-7"
                              onClick={() => handleRemove(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
