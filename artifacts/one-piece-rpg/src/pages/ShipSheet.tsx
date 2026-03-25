import { useState, useEffect } from "react";
import { useGetShip, useUpdateShip, useAddShipItem, useRemoveShipItem, type ShipInput } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Anchor, Shield, Coins, PackagePlus, Trash2, Search, Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";

export default function ShipSheet() {
  const [code, setCode] = useState<string>(() => localStorage.getItem("shipCode") || "");
  const [activeCode, setActiveCode] = useState<string>(() => localStorage.getItem("shipCode") || "");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const { data: ship, isLoading, refetch } = useGetShip(activeCode, { query: { enabled: !!activeCode, retry: false } });
  const updateMutation = useUpdateShip();
  const addItemMutation = useAddShipItem();
  const removeItemMutation = useRemoveShipItem();

  const [localShip, setLocalShip] = useState<ShipInput | null>(null);

  useEffect(() => {
    if (ship) {
      setLocalShip(ship);
    } else if (!isLoading && activeCode) {
      // Default ship if not found
      setLocalShip({
        name: "Novo Navio",
        currentHull: 100,
        maxHull: 100,
        treasury: 0,
        items: []
      });
    }
  }, [ship, isLoading, activeCode]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      localStorage.setItem("shipCode", code.trim());
      setActiveCode(code.trim());
    }
  };

  const debouncedSave = useDebounceCallback((updatedShip: ShipInput) => {
    if (!activeCode) return;
    updateMutation.mutate({ code: activeCode, data: updatedShip });
  }, 1500);

  const handleChange = (updates: Partial<ShipInput>) => {
    if (!localShip) return;
    const updated = { ...localShip, ...updates };
    setLocalShip(updated);
    debouncedSave(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCode || !newItemName.trim()) return;
    addItemMutation.mutate(
      { code: activeCode, data: { name: newItemName.trim(), quantity: newItemQuantity } },
      { onSuccess: () => {
          setNewItemName("");
          setNewItemQuantity(1);
          refetch();
        }
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeCode) return;
    removeItemMutation.mutate(
      { code: activeCode, itemId },
      { onSuccess: () => refetch() }
    );
  };

  if (!activeCode) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader className="text-center">
            <Anchor className="w-16 h-16 mx-auto text-primary mb-4" />
            <CardTitle className="text-3xl">Embarcar no Navio</CardTitle>
            <p className="text-muted-foreground mt-2">Digite o código do navio do seu bando para compartilhar itens e tesouros em tempo real.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                placeholder="Ex: merry-go-123"
                className="text-center text-lg"
                autoFocus
              />
              <Button type="submit" variant="gold" className="w-full" size="lg" disabled={!code.trim()}>
                Subir a Bordo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !localShip) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center justify-between bg-card/80 backdrop-blur p-4 rounded-2xl border border-border shadow-lg">
        <div>
          <p className="text-sm text-muted-foreground">Código do Navio</p>
          <p className="font-mono text-primary font-bold">{activeCode}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setActiveCode(""); localStorage.removeItem("shipCode"); }}>
          Sair do Navio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Anchor className="w-8 h-8 text-primary" />
            <Input 
              value={localShip.name} 
              onChange={e => handleChange({ name: e.target.value })}
              className="text-2xl font-display font-bold max-w-sm border-transparent focus-visible:border-primary bg-transparent px-2"
            />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Hull HP */}
          <div className="space-y-4 bg-background/50 p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-xl">
                <Shield className="w-6 h-6 text-orange-500" /> Casco
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase">Máx:</span>
                <Input 
                  type="number" 
                  value={localShip.maxHull} 
                  onChange={e => handleChange({ maxHull: parseInt(e.target.value) || 1 })}
                  className="w-20 h-9"
                />
              </div>
            </div>
            
            <div className="relative h-8 bg-secondary rounded-full overflow-hidden border border-border shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-800 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, (localShip.currentHull / (localShip.maxHull || 1)) * 100))}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-shadow-sm">
                {localShip.currentHull} / {localShip.maxHull}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-xl text-orange-400" onClick={() => handleChange({ currentHull: localShip.currentHull - 1 })}>-</Button>
              <Button variant="outline" className="flex-1 text-xl text-green-400" onClick={() => handleChange({ currentHull: localShip.currentHull + 1 })}>+</Button>
              <Button variant="outline" className="flex-none px-4 text-green-400" onClick={() => handleChange({ currentHull: localShip.maxHull })}>Reparar Total</Button>
            </div>
          </div>

          {/* Treasury */}
          <div className="space-y-4 bg-background/50 p-6 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <Coins className="fill-primary/20 w-6 h-6" /> Tesouro do Bando
            </div>
            
            <Input 
              type="number" 
              value={localShip.treasury} 
              onChange={e => handleChange({ treasury: parseInt(e.target.value) || 0 })}
              className="text-3xl font-display font-bold text-primary text-center h-16 bg-black/40"
            />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-primary/30 text-primary" onClick={() => handleChange({ treasury: Math.max(0, localShip.treasury - 1000) })}>-1k</Button>
              <Button variant="outline" className="flex-1 border-primary/30 text-primary" onClick={() => handleChange({ treasury: localShip.treasury + 1000 })}>+1k</Button>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Baú do Bando</CardTitle>
          <p className="text-sm text-muted-foreground">Itens compartilhados por todos os tripulantes.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddItem} className="flex gap-4">
            <Input 
              value={newItemName} 
              onChange={e => setNewItemName(e.target.value)} 
              placeholder="Nome do Item" 
              className="flex-1"
            />
            <Input 
              type="number" 
              min={1} 
              value={newItemQuantity} 
              onChange={e => setNewItemQuantity(parseInt(e.target.value) || 1)} 
              className="w-24 text-center"
            />
            <Button type="submit" variant="gold" className="w-32" disabled={!newItemName.trim() || addItemMutation.isPending}>
              {addItemMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PackagePlus className="w-4 h-4 mr-2"/> Adicionar</>}
            </Button>
          </form>

          <div className="rounded-xl border border-border overflow-hidden">
            {localShip.items?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-12 h-12 mb-2 opacity-20" />
                <p>O baú está vazio.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {localShip.items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-background/50 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">{item.name}</span>
                      <span className="px-2 py-1 rounded bg-black/40 text-sm font-mono text-muted-foreground border border-border">Qtd: {item.quantity}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
