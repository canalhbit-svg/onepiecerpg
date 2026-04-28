import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetCharacter, useSaveCharacter, useBuyForShip, type CharacterInput, type InventoryItem } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MARKET_CATALOG, type MarketItem } from "@/lib/game-data";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Coins, Anchor, CheckCircle, AlertCircle, Loader2, Plus, X, Trash2, Sparkles } from "lucide-react";
import { generateId } from "@/lib/utils";
import { isMasterUser } from "@/lib/auth";

type FeedbackMsg = { type: "success" | "error"; text: string };

const CATEGORIES = [
  { label: "⚔️ Armas", value: "Armas" },
  { label: "🛡️ Vestuário", value: "Vestuário" },
  { label: "🧭 Navegação", value: "Navegação" },
  { label: "🍱 Suprimentos", value: "Suprimentos" },
  { label: "💎 Raros", value: "Raros" },
];

const RARITY_LABELS: Record<string, string> = {
  comum: "Comum",
  raro: "Raro",
  epico: "Épico",
  lendario: "Lendário",
};

interface CustomMarketItem extends MarketItem {
  custom: true;
  rarity: string;
  createdBy?: string | null;
  createdByName?: string | null;
}

interface CustomItemRow {
  id: string;
  name: string;
  category: string;
  type: "weapon" | "consumable" | "tool";
  price: number;
  damage: string | null;
  attribute: string | null;
  effect: string | null;
  rarity: string;
  icon: string;
  createdBy: string | null;
  createdByName: string | null;
}

function formatBerries(n: number) {
  return `฿ ${n.toLocaleString("pt-BR")}`;
}

async function fetchCustomItems(): Promise<CustomItemRow[]> {
  const res = await fetch("/api/market/custom-items", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

interface NewItemFormState {
  name: string;
  category: string;
  type: "weapon" | "consumable" | "tool";
  price: string;
  damage: string;
  attribute: string;
  effect: string;
  rarity: "comum" | "raro" | "epico" | "lendario";
  icon: string;
}

const emptyNewItem = (category: string): NewItemFormState => ({
  name: "",
  category,
  type: "weapon",
  price: "100",
  damage: "",
  attribute: "",
  effect: "",
  rarity: "comum",
  icon: "📦",
});

export default function MarketPage() {
  const { user } = useAuth();
  const isMaster = isMasterUser(user);
  const queryClient = useQueryClient();

  const { data: character, isLoading, refetch } = useGetCharacter({ query: { retry: false } });
  const saveMutation = useSaveCharacter();
  const buyForShipMutation = useBuyForShip();

  const customItemsQuery = useQuery({
    queryKey: ["market-custom-items"],
    queryFn: fetchCustomItems,
    refetchInterval: 15000,
  });

  const createCustomMutation = useMutation({
    mutationFn: async (data: Omit<CustomItemRow, "id" | "createdBy" | "createdByName">) => {
      const res = await fetch("/api/market/custom-items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return res.json() as Promise<CustomItemRow>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-custom-items"] });
    },
  });

  const deleteCustomMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/market/custom-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-custom-items"] });
    },
  });

  const [feedback, setFeedback] = useState<FeedbackMsg | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Armas");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewItemFormState>(emptyNewItem("Armas"));
  const shipCode = localStorage.getItem("shipCode") || "";

  const showFeedback = (msg: FeedbackMsg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBuyForSelf = async (item: MarketItem) => {
    if (!character) return;
    if (character.berries < item.price) {
      showFeedback({ type: "error", text: `Berries insuficientes! Você tem ${formatBerries(character.berries)}.` });
      return;
    }

    setBuying(item.id + "-self");

    const currentInventory: InventoryItem[] = Array.isArray(character.inventory) ? character.inventory : [];
    const newInvItem: InventoryItem = {
      id: generateId(),
      name: item.name,
      type: item.type,
      damage: item.damage,
      attribute: item.attribute,
      effect: item.effect,
      quantity: 1,
      equipped: false,
    };

    const updated: CharacterInput = {
      ...character,
      berries: character.berries - item.price,
      inventory: [...currentInventory, newInvItem],
      xpLog: character.xpLog ?? [],
    };

    saveMutation.mutate(
      { data: updated },
      {
        onSuccess: () => {
          refetch();
          showFeedback({ type: "success", text: `${item.name} comprado e adicionado à mochila!` });
          setBuying(null);
        },
        onError: () => {
          showFeedback({ type: "error", text: "Erro ao salvar. Tente novamente." });
          setBuying(null);
        },
      }
    );
  };

  const handleBuyForShip = async (item: MarketItem) => {
    if (!shipCode) {
      showFeedback({ type: "error", text: "Entre em um navio primeiro na aba 'O Navio'!" });
      return;
    }

    setBuying(item.id + "-ship");
    buyForShipMutation.mutate(
      { code: shipCode, data: { name: item.name, quantity: 1, price: item.price } },
      {
        onSuccess: () => {
          showFeedback({ type: "success", text: `${item.name} comprado para o Baú do Bando!` });
          setBuying(null);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Tesouro insuficiente ou erro!";
          showFeedback({ type: "error", text: msg });
          setBuying(null);
        },
      }
    );
  };

  const handleCreateItem = () => {
    const price = parseInt(newItem.price, 10);
    if (!newItem.name.trim()) {
      showFeedback({ type: "error", text: "Dê um nome ao item." });
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      showFeedback({ type: "error", text: "Preço inválido." });
      return;
    }
    createCustomMutation.mutate(
      {
        name: newItem.name.trim(),
        category: newItem.category,
        type: newItem.type,
        price,
        damage: newItem.damage.trim() || null,
        attribute: newItem.attribute.trim().toLowerCase() || null,
        effect: newItem.effect.trim() || null,
        rarity: newItem.rarity,
        icon: newItem.icon.trim() || "📦",
      },
      {
        onSuccess: () => {
          showFeedback({ type: "success", text: `"${newItem.name.trim()}" adicionado ao Mercado!` });
          setNewItem(emptyNewItem(newItem.category));
          setShowAddForm(false);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Erro ao criar item.";
          showFeedback({ type: "error", text: msg });
        },
      }
    );
  };

  const handleDeleteCustom = (id: string, name: string) => {
    if (!confirm(`Remover "${name}" do mercado?`)) return;
    deleteCustomMutation.mutate(id, {
      onSuccess: () => showFeedback({ type: "success", text: "Item removido do mercado." }),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erro ao remover item.";
        showFeedback({ type: "error", text: msg });
      },
    });
  };

  const customItems: CustomMarketItem[] = (customItemsQuery.data ?? [])
    .filter(c => c.category === activeCategory)
    .map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      type: c.type,
      price: c.price,
      damage: c.damage ?? undefined,
      attribute: c.attribute ?? undefined,
      effect: c.effect ?? undefined,
      icon: c.icon,
      rarity: c.rarity,
      custom: true,
      createdBy: c.createdBy,
      createdByName: c.createdByName,
    }));

  const builtIn = MARKET_CATALOG.filter(i => i.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-card/80 backdrop-blur p-4 rounded-2xl border border-border shadow-lg gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-primary" />
          <div>
            <h2 className="text-xl font-display font-bold text-primary tracking-widest uppercase">Mercado Pirata</h2>
            <p className="text-sm text-muted-foreground">Compre itens com seus Berries ou com o Tesouro do Navio.</p>
          </div>
        </div>
        {character && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Seus Berries</p>
            <p className="text-xl font-display font-bold text-primary">{formatBerries(character.berries)}</p>
          </div>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-semibold ${
              feedback.type === "success"
                ? "bg-green-950/60 border-green-700/50 text-green-400"
                : "bg-red-950/60 border-red-700/50 text-red-400"
            }`}
          >
            {feedback.type === "success"
              ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ship code hint */}
      {shipCode ? (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-xl text-sm text-primary">
          <Anchor className="w-4 h-4" /> Navio conectado: <span className="font-mono font-bold">{shipCode}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-yellow-950/40 border border-yellow-700/40 px-4 py-2 rounded-xl text-sm text-yellow-400">
          <Anchor className="w-4 h-4" /> Entre em um Navio na aba "O Navio" para comprar para o Baú do Bando.
        </div>
      )}

      {/* Add custom item button + form */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5 text-primary" />
              Itens Customizados
            </CardTitle>
            <Button
              variant={showAddForm ? "outline" : "gold"}
              size="sm"
              onClick={() => {
                setShowAddForm(v => !v);
                setNewItem(emptyNewItem(activeCategory));
              }}
              data-testid="button-add-market-item"
            >
              {showAddForm ? <><X className="w-4 h-4 mr-1" /> Fechar</> : <><Plus className="w-4 h-4 mr-1" /> Novo Item</>}
            </Button>
          </div>
          {!showAddForm && (
            <p className="text-xs text-muted-foreground">
              Não achou o que precisa? Crie um item novo (qualquer pirata pode adicionar; o mestre e o criador podem remover).
            </p>
          )}
        </CardHeader>
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                  <Input
                    placeholder="Nome (ex: Wado Ichimonji)"
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    className="sm:col-span-4"
                    data-testid="input-new-item-name"
                  />
                  <Input
                    placeholder="Ícone"
                    value={newItem.icon}
                    onChange={e => setNewItem({ ...newItem, icon: e.target.value })}
                    maxLength={4}
                    className="sm:col-span-1 text-center text-lg"
                  />
                  <Input
                    type="number"
                    placeholder="Preço"
                    value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    className="sm:col-span-1"
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <select
                    value={newItem.type}
                    onChange={e => setNewItem({ ...newItem, type: e.target.value as "weapon" | "consumable" | "tool" })}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    <option value="weapon">⚔️ Arma</option>
                    <option value="consumable">🧪 Consumível</option>
                    <option value="tool">🔧 Ferramenta</option>
                  </select>
                  <select
                    value={newItem.rarity}
                    onChange={e => setNewItem({ ...newItem, rarity: e.target.value as NewItemFormState["rarity"] })}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    <option value="comum">⬜ Comum</option>
                    <option value="raro">🔵 Raro</option>
                    <option value="epico">🟣 Épico</option>
                    <option value="lendario">🌟 Lendário</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Dano (ex: 1d8 + 2)"
                    value={newItem.damage}
                    onChange={e => setNewItem({ ...newItem, damage: e.target.value })}
                  />
                  <Input
                    placeholder="Atributo (vigor, agility, ...)"
                    value={newItem.attribute}
                    onChange={e => setNewItem({ ...newItem, attribute: e.target.value })}
                  />
                </div>

                <textarea
                  placeholder="Descrição / efeito do item..."
                  value={newItem.effect}
                  onChange={e => setNewItem({ ...newItem, effect: e.target.value })}
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <Button
                  variant="gold"
                  className="w-full"
                  onClick={handleCreateItem}
                  disabled={createCustomMutation.isPending || !newItem.name.trim()}
                  data-testid="button-save-new-item"
                >
                  {createCustomMutation.isPending
                    ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    : <Plus className="w-4 h-4 mr-2" />}
                  Adicionar ao Mercado
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
            data-testid={`tab-category-${cat.value}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...customItems, ...builtIn].map(item => {
            const isCustom = "custom" in item && (item as CustomMarketItem).custom;
            const customItem = isCustom ? (item as CustomMarketItem) : null;
            const canAfford = character ? character.berries >= item.price : false;
            const isBuyingSelf = buying === item.id + "-self";
            const isBuyingShip = buying === item.id + "-ship";
            const canDelete = isCustom && (isMaster || customItem?.createdBy === user?.id);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`h-full ${isCustom ? "border-primary/40" : ""}`}>
                  <CardContent className="pt-6 space-y-4 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-4xl">{item.icon}</div>
                      <div className="text-right">
                        <div className="text-xl font-display font-bold text-primary">{formatBerries(item.price)}</div>
                        {!canAfford && character && (
                          <div className="text-xs text-red-400 mt-0.5">Insuficiente</div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                        {isCustom && (
                          <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded font-bold flex items-center gap-1 flex-shrink-0">
                            <Sparkles className="w-3 h-3" /> Custom
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.damage && (
                          <span className="text-xs font-mono text-yellow-400 bg-yellow-950/40 border border-yellow-700/40 px-2 py-1 rounded">
                            Dano: {item.damage}
                          </span>
                        )}
                        {item.attribute && (
                          <span className="text-xs text-blue-400 bg-blue-950/40 border border-blue-700/40 px-2 py-1 rounded capitalize">
                            {item.attribute}
                          </span>
                        )}
                        {customItem && customItem.rarity !== "comum" && (
                          <span className="text-xs text-purple-300 bg-purple-950/40 border border-purple-700/40 px-2 py-1 rounded capitalize">
                            {RARITY_LABELS[customItem.rarity] ?? customItem.rarity}
                          </span>
                        )}
                      </div>
                      {item.effect && (
                        <p className="text-sm text-muted-foreground mt-2">{item.effect}</p>
                      )}
                      {customItem?.createdByName && (
                        <p className="text-[11px] text-muted-foreground/70 mt-2 italic">
                          Criado por {customItem.createdByName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="gold"
                        className="w-full"
                        disabled={!canAfford || isBuyingSelf || !character}
                        onClick={() => handleBuyForSelf(item)}
                        data-testid={`button-buy-self-${item.id}`}
                      >
                        {isBuyingSelf
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <><Coins className="w-4 h-4 mr-2" /> Comprar para Mim</>}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
                        disabled={!shipCode || isBuyingShip}
                        onClick={() => handleBuyForShip(item)}
                        data-testid={`button-buy-ship-${item.id}`}
                      >
                        {isBuyingShip
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <><Anchor className="w-4 h-4 mr-2" /> Comprar para o Navio</>}
                      </Button>
                      {canDelete && customItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCustom(customItem.id, customItem.name)}
                          disabled={deleteCustomMutation.isPending}
                          data-testid={`button-delete-custom-${customItem.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover do Mercado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {customItems.length === 0 && builtIn.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center col-span-full">
              Nenhum item nessa categoria ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
