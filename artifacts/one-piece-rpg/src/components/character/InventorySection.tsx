import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword, Backpack, Trash2, Plus, Zap, ShieldCheck,
  FlaskConical, Wrench, Package
} from "lucide-react";
import type { CharacterInput, InventoryItem } from "@workspace/api-client-react";
import { generateId } from "@/lib/utils";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

function rollDice(notation: string): { rolls: number[]; total: number } {
  const match = notation.match(/(\d+)d(\d+)/i);
  if (!match) return { rolls: [0], total: 0 };
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}

const TYPE_ICONS = {
  weapon: <Sword className="w-4 h-4 text-red-400" />,
  consumable: <FlaskConical className="w-4 h-4 text-green-400" />,
  tool: <Wrench className="w-4 h-4 text-blue-400" />,
};

const TYPE_LABELS = {
  weapon: "Arma",
  consumable: "Consumível",
  tool: "Ferramenta",
};

interface AttackResult {
  itemId: string;
  rolls: number[];
  total: number;
}

interface UseResult {
  itemId: string;
  roll: number;
  healed: number;
}

export function InventorySection({ character, onChange }: Props) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"weapon" | "consumable" | "tool">("weapon");
  const [newItemDamage, setNewItemDamage] = useState("");
  const [newItemEffect, setNewItemEffect] = useState("");
  const [attackResult, setAttackResult] = useState<AttackResult | null>(null);
  const [useResult, setUseResult] = useState<UseResult | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const inventory: InventoryItem[] = Array.isArray(character.inventory) ? character.inventory : [];

  const updateInventory = (items: InventoryItem[]) => {
    onChange({ inventory: items });
  };

  const handleEquip = (itemId: string) => {
    // Unequip all weapons first, then equip the target
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
    if (!item.damage) {
      // Provisões: cura fixa 2
      const healed = 2;
      const newHp = Math.min(character.currentHp + healed, character.maxHp);
      onChange({ currentHp: newHp });
      setUseResult({ itemId: item.id, roll: healed, healed: newHp - character.currentHp });

      // Consume 1 use
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
    } else {
      // Kit médico / outros consumíveis com dado
      const result = rollDice(item.damage);
      const healed = result.total;
      const newHp = Math.min(character.currentHp + healed, character.maxHp);
      onChange({ currentHp: newHp });
      setUseResult({ itemId: item.id, roll: healed, healed: newHp - character.currentHp });

      // Consume 1 use
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
    }
  };

  const handleRemove = (itemId: string) => {
    updateInventory(inventory.filter(i => i.id !== itemId));
    if (attackResult?.itemId === itemId) setAttackResult(null);
    if (useResult?.itemId === itemId) setUseResult(null);
  };

  const handleAddManual = () => {
    if (!newItemName.trim()) return;
    const newItem: InventoryItem = {
      id: generateId(),
      name: newItemName.trim(),
      type: newItemType,
      damage: newItemDamage.trim() || undefined,
      effect: newItemEffect.trim() || undefined,
      quantity: 1,
      equipped: false,
    };
    updateInventory([...inventory, newItem]);
    setNewItemName("");
    setNewItemDamage("");
    setNewItemEffect("");
    setShowAdd(false);
  };

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
            onClick={() => setShowAdd(v => !v)}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
        {equippedWeapon && (
          <div className="mt-2 flex items-center gap-2 bg-red-950/40 border border-red-700/40 rounded-lg px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300 font-semibold">
              Equipado: {equippedWeapon.name}
              {equippedWeapon.damage && <span className="ml-2 font-mono text-red-400">({equippedWeapon.damage})</span>}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add manually */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-background/60 border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Adicionar Item Manualmente</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Nome do Item"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="col-span-2"
                  />
                  <select
                    value={newItemType}
                    onChange={e => setNewItemType(e.target.value as "weapon" | "consumable" | "tool")}
                    className="col-span-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    <option value="weapon">Arma</option>
                    <option value="consumable">Consumível</option>
                    <option value="tool">Ferramenta</option>
                  </select>
                  <Input
                    placeholder="Dano (ex: 1d6)"
                    value={newItemDamage}
                    onChange={e => setNewItemDamage(e.target.value)}
                  />
                  <Input
                    placeholder="Efeito / Descrição"
                    value={newItemEffect}
                    onChange={e => setNewItemEffect(e.target.value)}
                    className="col-span-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="gold" className="flex-1" onClick={handleAddManual} disabled={!newItemName.trim()}>
                    <Package className="w-4 h-4 mr-2" /> Adicionar à Mochila
                  </Button>
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
                </div>
              </div>
            </motion.div>
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
              const isAttacking = attackResult?.itemId === item.id;
              const isUsed = useResult?.itemId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border rounded-xl p-3 transition-all ${
                    item.equipped
                      ? "border-red-700/60 bg-red-950/20"
                      : "border-border bg-background/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="mt-0.5">{TYPE_ICONS[item.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{item.name}</span>
                          {item.quantity > 1 && (
                            <span className="text-xs bg-black/40 border border-border px-2 py-0.5 rounded font-mono text-muted-foreground">
                              x{item.quantity}
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
                            <span className="text-xs text-red-400 font-bold uppercase">⚔ Equipado</span>
                          )}
                        </div>
                        {item.effect && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{item.effect}</p>
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
                    <div className="flex items-center gap-1 flex-shrink-0">
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
                        className="text-destructive hover:bg-destructive/20 w-7 h-7"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
