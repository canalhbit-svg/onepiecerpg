import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import type { CharacterInput } from "@workspace/api-client-react";
import { DICE_COSTS, type AttributeKey } from "@/lib/game-data";
import { useAuth } from "@workspace/replit-auth-web";
import { isMasterUser } from "@/lib/auth";
import { Lock } from "lucide-react";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function XPSection({ character, onChange }: Props) {
  const { user } = useAuth();
  const isPlayer = !isMasterUser(user);
  // Calculate spent XP
  let xpSpent = 0;
  const attributes: AttributeKey[] = ['vigor', 'agility', 'cunning', 'charisma', 'spirit'];
  attributes.forEach(attr => {
    const pool = character[attr]?.dicePool;
    if (pool) {
      xpSpent += (pool.d4 * DICE_COSTS.d4);
      xpSpent += (pool.d6 * DICE_COSTS.d6);
      xpSpent += (pool.d10 * DICE_COSTS.d10);
      xpSpent += (pool.d20 * DICE_COSTS.d20);
    }
  });

  const xpAvailable = (4 + character.xpTotal) - xpSpent;

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            XP Total Ganho
            {isPlayer && <Lock className="w-3 h-3 text-amber-500" />}
          </label>
          <Input
            type="number"
            min={0}
            value={character.xpTotal}
            onChange={e => onChange({ xpTotal: parseInt(e.target.value) || 0 })}
            readOnly={isPlayer}
            disabled={isPlayer}
            className={`text-2xl font-bold text-primary max-w-[200px] ${isPlayer ? "opacity-80 cursor-not-allowed" : ""}`}
          />
          {isPlayer && (
            <p className="text-[10px] text-muted-foreground italic">
              Apenas o Mestre pode alterar seu XP Total.
            </p>
          )}
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center sm:items-end space-y-1">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">XP Disponível</span>
          <div className={`text-4xl font-display font-bold ${xpAvailable < 0 ? 'text-destructive' : 'text-primary text-glow'}`}>
            {xpAvailable}
          </div>
          <span className="text-xs text-muted-foreground">(4 Iniciais + Total - Gastos)</span>
        </div>
      </CardContent>
    </Card>
  );
}
