import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ORIGINS, SPECIALTIES, ORIGIN_ADVANTAGES, SPECIALTY_PERKS } from "@/lib/game-data";
import type { CharacterInput } from "@workspace/api-client-react";
import { Info, Star, Anchor, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import { isMasterUser } from "@/lib/auth";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function IdentitySection({ character, onChange }: Props) {
  const { user } = useAuth();
  const isPlayer = !isMasterUser(user);
  const originAdvantage = character.origin ? ORIGIN_ADVANTAGES[character.origin] : null;
  const specialtyPerk = character.specialty ? SPECIALTY_PERKS[character.specialty] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identidade do Pirata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nome do Jogador</label>
            <Input
              value={character.playerName}
              onChange={e => onChange({ playerName: e.target.value })}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nome do Pirata</label>
            <Input
              value={character.pirateName}
              onChange={e => onChange({ pirateName: e.target.value })}
              placeholder="Ex: Monkey D. Luffy"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Origem</label>
            <Select
              value={character.origin}
              onChange={e => onChange({ origin: e.target.value })}
              options={ORIGINS.map(o => ({ value: o, label: o }))}
              placeholder="Selecione a Origem"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Especialidade
              <span className="ml-2 text-xs text-primary font-normal">(Concede item inicial)</span>
            </label>
            <Select
              value={character.specialty}
              onChange={e => onChange({ specialty: e.target.value })}
              options={SPECIALTIES.map(o => ({ value: o, label: o }))}
              placeholder="Selecione a Especialidade"
            />
          </div>
        </div>

        {/* Bounty — read-only para jogadores */}
        <div className="bg-amber-950/20 border border-amber-700/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                Recompensa (Bounty)
                {isPlayer && <Lock className="w-3 h-3" />}
              </div>
              <div className="text-xs text-muted-foreground">
                {isPlayer ? "Definida pelo Mestre conforme suas façanhas." : "Você pode ajustar a recompensa deste pirata."}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 font-bold">฿</span>
            <Input
              type="number"
              min={0}
              value={character.bounty ?? 0}
              onChange={e => onChange({ bounty: parseInt(e.target.value) || 0 })}
              readOnly={isPlayer}
              disabled={isPlayer}
              className={`text-right text-amber-300 font-bold max-w-[180px] ${isPlayer ? "opacity-80 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>

        {/* Advantage / Perk display */}
        <AnimatePresence>
          {(originAdvantage || specialtyPerk) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {originAdvantage && (
                  <div className="flex gap-3 bg-blue-950/30 border border-blue-700/40 rounded-xl p-4">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                        Vantagem de Origem — {character.origin}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{originAdvantage.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{originAdvantage.description}</p>
                    </div>
                  </div>
                )}
                {specialtyPerk && (
                  <div className="flex gap-3 bg-yellow-950/30 border border-yellow-700/40 rounded-xl p-4">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">
                        Habilidade — {character.specialty}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{specialtyPerk.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{specialtyPerk.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
