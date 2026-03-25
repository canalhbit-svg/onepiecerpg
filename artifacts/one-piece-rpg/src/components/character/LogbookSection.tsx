import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CharacterInput } from "@workspace/api-client-react";

interface Props {
  character: CharacterInput;
  onChange: (updates: Partial<CharacterInput>) => void;
}

export function LogbookSection({ character, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diário de Bordo</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={character.logbook}
          onChange={e => onChange({ logbook: e.target.value })}
          placeholder="Escreva suas anotações, pistas e histórias aqui..."
          className="w-full min-h-[300px] p-6 rounded-xl border-2 border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-y font-serif leading-relaxed"
        />
      </CardContent>
    </Card>
  );
}
