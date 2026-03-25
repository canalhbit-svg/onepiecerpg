import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ORIGINS, SPECIALTIES } from "@/lib/game-data";
import type { CharacterInput } from "@workspace/api-client-react";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function IdentitySection({ character, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identidade do Pirata</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Especialidade</label>
          <Select 
            value={character.specialty} 
            onChange={e => onChange({ specialty: e.target.value })}
            options={SPECIALTIES.map(o => ({ value: o, label: o }))}
            placeholder="Selecione a Especialidade"
          />
        </div>
      </CardContent>
    </Card>
  );
}
