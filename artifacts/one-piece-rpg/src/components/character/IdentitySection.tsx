import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ORIGINS, SPECIALTIES, ORIGIN_ADVANTAGES, SPECIALTY_PERKS } from "@/lib/game-data";
import type { CharacterInput } from "@workspace/api-client-react";
import { Info, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function IdentitySection({ character, onChange }: Props) {
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
