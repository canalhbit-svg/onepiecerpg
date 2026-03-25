import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dices, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, generateId } from "@/lib/utils";
import type { CharacterInput, XPLogEntry } from "@workspace/api-client-react";
import { ATTRIBUTES, DICE_COSTS, ORIGIN_BONUSES, SPECIALTY_BONUSES, type AttributeKey, type DiceType } from "@/lib/game-data";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
  xpAvailable: number;
}

interface RollDetail {
  base: number[];
  xp: number[];
  bonus: number[];
  total: number;
}

function rollDice(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export function AttributesSection({ character, onChange, xpAvailable }: Props) {
  const [rollResults, setRollResults] = useState<Record<string, RollDetail>>({});
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});

  const getBonusDice = (attr: AttributeKey) => {
    const dice: DiceType[] = [];
    if (ORIGIN_BONUSES[character.origin]?.attr === attr) {
      dice.push(ORIGIN_BONUSES[character.origin].dice);
    }
    if (SPECIALTY_BONUSES[character.specialty]?.attr === attr) {
      dice.push(SPECIALTY_BONUSES[character.specialty].dice);
    }
    return dice;
  };

  const handleRoll = (attr: AttributeKey) => {
    const baseRoll = [rollDice(6)];
    
    const xpRolls: number[] = [];
    const pool = character[attr].dicePool;
    for(let i=0; i<pool.d4; i++) xpRolls.push(rollDice(4));
    for(let i=0; i<pool.d6; i++) xpRolls.push(rollDice(6));
    for(let i=0; i<pool.d10; i++) xpRolls.push(rollDice(10));
    for(let i=0; i<pool.d20; i++) xpRolls.push(rollDice(20));

    const bonusDice = getBonusDice(attr);
    const bonusRolls = bonusDice.map(d => rollDice(parseInt(d.substring(1))));

    const total = baseRoll[0] + xpRolls.reduce((a,b)=>a+b,0) + bonusRolls.reduce((a,b)=>a+b,0);

    setRollResults(prev => ({ ...prev, [attr]: { base: baseRoll, xp: xpRolls, bonus: bonusRolls, total } }));
    
    onChange({
      [attr]: { ...character[attr], value: total }
    });
  };

  const handleManualEdit = (attr: AttributeKey, val: number) => {
    setHighlights(prev => ({ ...prev, [attr]: true }));
    setTimeout(() => setHighlights(prev => ({ ...prev, [attr]: false })), 1500);
    onChange({
      [attr]: { ...character[attr], value: val }
    });
  };

  const buyDice = (attr: AttributeKey, dice: DiceType) => {
    const cost = DICE_COSTS[dice];
    if (xpAvailable < cost) return;

    const newLog: XPLogEntry = {
      id: generateId(),
      attribute: attr,
      diceType: dice,
      cost,
      timestamp: new Date().toISOString()
    };

    onChange({
      [attr]: {
        ...character[attr],
        dicePool: { ...character[attr].dicePool, [dice]: character[attr].dicePool[dice] + 1 }
      },
      xpLog: [newLog, ...character.xpLog].slice(0, 50)
    });
  };

  const removeDice = (attr: AttributeKey, dice: DiceType) => {
    if (character[attr].dicePool[dice] <= 0) return;
    
    const newLog: XPLogEntry = {
      id: generateId(),
      attribute: attr,
      diceType: dice,
      cost: -DICE_COSTS[dice],
      timestamp: new Date().toISOString()
    };

    onChange({
      [attr]: {
        ...character[attr],
        dicePool: { ...character[attr].dicePool, [dice]: character[attr].dicePool[dice] - 1 }
      },
      xpLog: [newLog, ...character.xpLog].slice(0, 50)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atributos e Upgrades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ATTRIBUTES.map(({ key, label, icon }) => {
          const pool = character[key].dicePool;
          const bonus = getBonusDice(key);
          const result = rollResults[key];
          
          return (
            <div key={key} className="p-4 rounded-xl bg-background/50 border border-border/50 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                
                {/* Header & Value */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border border-border">
                    {icon}
                  </div>
                  <div className="flex-1 md:w-32">
                    <span className="font-bold text-lg">{label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={character[key].value}
                      onChange={e => handleManualEdit(key, parseInt(e.target.value) || 0)}
                      className={cn("w-20 text-center font-bold text-xl", highlights[key] && "border-amber-500 ring-2 ring-amber-500/50")}
                    />
                    <Button variant="gold" size="icon" onClick={() => handleRoll(key)}>
                      <Dices className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                {/* Upgrades */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-muted-foreground mr-2">Comprar:</span>
                    {(['d4', 'd6', 'd10', 'd20'] as DiceType[]).map(d => (
                      <Button 
                        key={d} 
                        variant="outline" 
                        size="sm" 
                        onClick={() => buyDice(key, d)}
                        disabled={xpAvailable < DICE_COSTS[d]}
                        className="text-xs h-7 px-2"
                      >
                        +{d} ({DICE_COSTS[d]}XP)
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center mt-3 min-h-[28px]">
                    <span className="text-xs text-muted-foreground mr-2 font-mono border border-border/50 px-2 py-0.5 rounded bg-black/40">1d6 Base</span>
                    
                    {bonus.map((b, i) => (
                      <span key={`b-${i}`} className="text-xs font-mono border border-green-500/50 text-green-400 px-2 py-0.5 rounded bg-green-950/40">
                        +{b} (Bônus)
                      </span>
                    ))}

                    {(['d4', 'd6', 'd10', 'd20'] as DiceType[]).map(d => {
                      const count = pool[d];
                      if (count === 0) return null;
                      return Array.from({length: count}).map((_, i) => (
                        <div key={`${d}-${i}`} className="flex items-center text-xs font-mono border border-primary/50 text-primary px-2 py-0.5 rounded bg-primary/10">
                          +{d}
                          <button onClick={() => removeDice(key, d)} className="ml-1 hover:text-destructive transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              </div>

              {/* Roll Result Popover */}
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 rounded-lg bg-black/60 border border-primary/30 flex flex-wrap items-center gap-2"
                  >
                    <span className="text-sm text-muted-foreground">Resultado:</span>
                    <span className="text-sm font-mono bg-secondary px-2 py-1 rounded border border-border">
                      [Base: <span className="text-white">{result.base.join(',')}</span>]
                    </span>
                    
                    {result.xp.length > 0 && (
                      <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded border border-primary/30 text-primary">
                        [XP: <span className="font-bold">{result.xp.join(' + ')}</span>]
                      </span>
                    )}

                    {result.bonus.length > 0 && (
                      <span className="text-sm font-mono bg-green-900/20 px-2 py-1 rounded border border-green-500/30 text-green-400">
                        [Bônus: <span className="font-bold">{result.bonus.join(' + ')}</span>]
                      </span>
                    )}

                    <span className="text-muted-foreground">=</span>
                    <span className="text-xl font-bold text-primary text-glow ml-2">
                      {result.total}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
