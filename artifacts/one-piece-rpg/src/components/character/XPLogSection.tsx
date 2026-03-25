import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { XPLogEntry } from "@workspace/api-client-react";

interface Props {
  log: XPLogEntry[];
}

export function XPLogSection({ log }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Histórico de XP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 overflow-y-auto pr-4 space-y-2">
          {log.length === 0 ? (
            <p className="text-muted-foreground text-sm italic text-center py-8">Nenhum gasto registrado ainda.</p>
          ) : (
            log.map((entry) => {
              const isRefund = entry.cost < 0;
              return (
                <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg border ${isRefund ? 'bg-green-950/20 border-green-900/30' : 'bg-background/50 border-border/50'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold capitalize text-foreground">{entry.attribute}</span>
                    <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm px-2 py-1 rounded bg-black/40 border border-border/50">
                      {isRefund ? '-' : '+'}{entry.diceType}
                    </span>
                    <span className={`font-bold ${isRefund ? 'text-green-400' : 'text-primary'}`}>
                      {isRefund ? '+' : '-'}{Math.abs(entry.cost)} XP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
