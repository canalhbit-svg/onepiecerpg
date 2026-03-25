import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart, Coins, Plus, Minus } from "lucide-react";
import type { CharacterInput } from "@workspace/api-client-react";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function CombatSection({ character, onChange }: Props) {
  const hpPercent = Math.max(0, Math.min(100, (character.currentHp / (character.maxHp || 1)) * 100));

  const adjustHp = (amount: number) => {
    onChange({ currentHp: character.currentHp + amount });
  };

  const adjustBerries = (amount: number) => {
    onChange({ berries: Math.max(0, character.berries + amount) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status & Economia</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* HP Block */}
        <div className="space-y-4 bg-background/50 p-6 rounded-xl border border-destructive/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive font-bold text-xl">
              <Heart className="fill-destructive w-6 h-6" /> Vida
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground uppercase">Máxima:</span>
              <Input 
                type="number" 
                value={character.maxHp} 
                onChange={e => onChange({ maxHp: parseInt(e.target.value) || 1 })}
                className="w-20 h-9"
              />
            </div>
          </div>
          
          <div className="relative h-8 bg-secondary rounded-full overflow-hidden border border-border shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-800 to-destructive transition-all duration-500 ease-out"
              style={{ width: `${hpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-shadow-sm">
              {character.currentHp} / {character.maxHp}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 text-2xl text-red-400 hover:bg-red-950/30 border-red-900/30" onClick={() => adjustHp(-1)}>
              <Minus />
            </Button>
            <Button variant="outline" size="lg" className="flex-1 text-2xl text-green-400 hover:bg-green-950/30 border-green-900/30" onClick={() => adjustHp(1)}>
              <Plus />
            </Button>
            <Button variant="outline" size="lg" className="flex-none px-4 text-green-400 hover:bg-green-950/30 border-green-900/30" onClick={() => adjustHp(5)}>
              +5
            </Button>
          </div>
        </div>

        {/* Economy Block */}
        <div className="space-y-4 bg-background/50 p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Coins className="fill-primary/20 w-6 h-6" /> Berries (฿)
          </div>
          
          <Input 
            type="number" 
            value={character.berries} 
            onChange={e => onChange({ berries: parseInt(e.target.value) || 0 })}
            className="text-3xl font-display font-bold text-primary text-center h-16 bg-black/40"
          />

          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 border-primary/30 text-primary hover:bg-primary/10" onClick={() => adjustBerries(-1000)}>
              -1k
            </Button>
            <Button variant="outline" size="lg" className="flex-1 border-primary/30 text-primary hover:bg-primary/10" onClick={() => adjustBerries(1000)}>
              +1k
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
