import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart, Coins, Plus, Minus, Zap } from "lucide-react";
import type { CharacterInput } from "@workspace/api-client-react";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function CombatSection({ character, onChange }: Props) {
  const hpPercent = Math.max(0, Math.min(100, (character.currentHp / (character.maxHp || 1)) * 100));

  const maxStamina = (character.vigor?.value ?? 0) * 10;
  const currentStamina = character.currentStamina ?? 0;
  const staminaPercent = maxStamina > 0 ? Math.max(0, Math.min(100, (currentStamina / maxStamina) * 100)) : 0;
  const staminaColor = staminaPercent > 50 ? "from-blue-700 to-blue-400" : staminaPercent > 20 ? "from-yellow-700 to-yellow-400" : "from-red-800 to-red-500";
  const isExhausted = currentStamina <= 0 && maxStamina > 0;

  const adjustHp = (amount: number) => {
    onChange({ currentHp: character.currentHp + amount });
  };

  const adjustBerries = (amount: number) => {
    onChange({ berries: Math.max(0, character.berries + amount) });
  };

  const adjustStamina = (amount: number) => {
    const next = Math.max(0, Math.min(maxStamina, currentStamina + amount));
    onChange({ currentStamina: next });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status & Economia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
        </div>

        {/* Stamina Block */}
        <div className={`space-y-4 bg-background/50 p-5 rounded-xl border ${isExhausted ? "border-red-600" : "border-blue-900/30"}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 font-bold text-lg ${isExhausted ? "text-red-400" : "text-blue-400"}`}>
              <Zap className="w-5 h-5" /> Stamina
              {isExhausted && <span className="text-xs border border-red-600 text-red-400 rounded px-2 py-0.5 ml-1">EXAUSTÃO</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Máx: {maxStamina}</span>
              <span className="text-xs text-muted-foreground">(Vigor × 10)</span>
            </div>
          </div>

          <div className="relative h-7 bg-secondary rounded-full overflow-hidden border border-border shadow-inner">
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${staminaColor} transition-all duration-500 ease-out`}
              style={{ width: `${staminaPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">
              {currentStamina} / {maxStamina}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="text-red-400 border-red-700/40 hover:bg-red-950/20" onClick={() => adjustStamina(-10)}>
              -10
            </Button>
            <Button variant="outline" size="sm" className="text-red-400 border-red-700/40 hover:bg-red-950/20" onClick={() => adjustStamina(-5)}>
              -5
            </Button>
            <Button variant="outline" size="sm" className="text-green-400 border-green-700/40 hover:bg-green-950/20" onClick={() => adjustStamina(10)}>
              +10
            </Button>
            <Button variant="outline" size="sm" className="text-green-400 border-green-700/40 hover:bg-green-950/20" onClick={() => adjustStamina(20)}>
              +20
            </Button>
            <Button variant="outline" size="sm" className="text-blue-400 border-blue-700/40 hover:bg-blue-950/20" onClick={() => adjustStamina(maxStamina)}>
              Restaurar
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
