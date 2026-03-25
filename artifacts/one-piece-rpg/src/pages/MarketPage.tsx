import { useState } from "react";
import { useGetCharacter, useSaveCharacter, useBuyForShip, type CharacterInput, type InventoryItem } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MARKET_CATALOG, type MarketItem } from "@/lib/game-data";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Coins, Anchor, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { generateId } from "@/lib/utils";

type FeedbackMsg = { type: "success" | "error"; text: string };

const CATEGORIES = [
  { label: "⚔️ Armas", value: "Armas" },
  { label: "🛡️ Vestuário", value: "Vestuário" },
  { label: "🧭 Navegação", value: "Navegação" },
  { label: "🍱 Suprimentos", value: "Suprimentos" },
  { label: "💎 Raros", value: "Raros" },
];

function formatBerries(n: number) {
  return `฿ ${n.toLocaleString("pt-BR")}`;
}

export default function MarketPage() {
  const { data: character, isLoading, refetch } = useGetCharacter({ query: { retry: false } });
  const saveMutation = useSaveCharacter();
  const buyForShipMutation = useBuyForShip();

  const [feedback, setFeedback] = useState<FeedbackMsg | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Armas");
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
    const newItem: InventoryItem = {
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
      inventory: [...currentInventory, newItem],
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

  const filtered = MARKET_CATALOG.filter(i => i.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-card/80 backdrop-blur p-4 rounded-2xl border border-border shadow-lg">
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
          {filtered.map(item => {
            const canAfford = character ? character.berries >= item.price : false;
            const isBuyingSelf = buying === item.id + "-self";
            const isBuyingShip = buying === item.id + "-ship";

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="h-full">
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
                      <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
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
                      </div>
                      {item.effect && (
                        <p className="text-sm text-muted-foreground mt-2">{item.effect}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="gold"
                        className="w-full"
                        disabled={!canAfford || isBuyingSelf || !character}
                        onClick={() => handleBuyForSelf(item)}
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
                      >
                        {isBuyingShip
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <><Anchor className="w-4 h-4 mr-2" /> Comprar para o Navio</>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
