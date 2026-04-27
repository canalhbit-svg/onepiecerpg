import { Lock, Sparkles, Star, ChevronRight } from "lucide-react";
import {
  HAKI_TRACKS,
  AKUMA_GENERAL,
  AKUMA_TYPE,
  getHakiLevel,
  getAkumaLevel,
  type HakiTrack,
} from "@/lib/progression";
import type { CharacterInput } from "@workspace/api-client-react";
import type { FruitType } from "@/lib/powers-data";

interface AnyAttr { value?: number }

function getStat(character: CharacterInput, key: HakiTrack["statKey"]): number {
  const attr = character[key] as AnyAttr | null | undefined;
  return attr?.value ?? 0;
}

export function HakiProgressionTrack({
  character,
  track,
  isUnlocked,
}: {
  character: CharacterInput;
  track: HakiTrack;
  isUnlocked: boolean;
}) {
  const stat = getStat(character, track.statKey);
  const { level, current, next } = getHakiLevel(stat, track);
  const max = track.milestones[track.milestones.length - 1].threshold;
  const pct = Math.min(100, (stat / max) * 100);
  const nextDelta = next ? next.threshold - stat : 0;

  return (
    <div className={`rounded-xl border p-4 ${track.color} space-y-4`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{track.icon}</span>
          <div>
            <p className={`font-bold ${track.textColor}`}>{track.name}</p>
            <p className="text-[11px] text-muted-foreground tracking-wider uppercase">{track.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {track.statLabel}
          </div>
          <div className={`font-display font-bold text-2xl ${track.textColor}`}>{stat}</div>
        </div>
      </div>

      {!isUnlocked ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground italic bg-black/20 rounded-lg px-3 py-2 border border-border/40">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          Bloqueado pelo Mestre. A progressão por {track.statLabel} continua aparecendo abaixo como referência.
        </div>
      ) : null}

      {/* Current level badge */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-black/40 ${track.textColor}`}>
            Nível Atual
          </span>
          <span className={`font-display font-bold text-lg ${level > 0 ? track.textColor : "text-muted-foreground"}`}>
            NV {level} / 10
          </span>
        </div>
        {current && isUnlocked && (
          <div className="text-xs text-muted-foreground">
            Custo atual: <span className={`font-bold ${track.textColor}`}>{current.staminaCost} Stamina</span>
          </div>
        )}
      </div>

      {/* Progress bar to next */}
      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-primary/60 to-primary transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground tracking-wider uppercase">
          <span>{stat} {track.statLabel}</span>
          {next ? (
            <span>Faltam {nextDelta} para NV {next.level}</span>
          ) : (
            <span className="text-primary font-bold">MAESTRIA TOTAL</span>
          )}
        </div>
      </div>

      {/* Current bonus highlight */}
      {current && (
        <div className="bg-black/30 border border-border/60 rounded-lg p-3 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Bônus desbloqueado
          </p>
          <p className={`text-sm font-semibold ${track.textColor}`}>{current.summary}</p>
          {current.unlock && (
            <p className="text-xs text-amber-300 flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              {current.unlock}
            </p>
          )}
        </div>
      )}

      {/* Next milestone teaser */}
      {next && (
        <div className="border border-dashed border-border/60 rounded-lg p-3 bg-background/30 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            Próximo marco — NV {next.level} ({track.statLabel} {next.threshold})
          </p>
          <p className="text-sm text-foreground/90">{next.summary}</p>
          {next.unlock && (
            <p className="text-xs text-amber-300/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Destrava: {next.unlock}
            </p>
          )}
        </div>
      )}

      {/* All milestones list */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
          Ver todos os 10 níveis
        </summary>
        <div className="mt-3 space-y-2">
          {track.milestones.map((m) => {
            const reached = stat >= m.threshold;
            return (
              <div
                key={m.level}
                className={`grid grid-cols-[auto_auto_1fr_auto] items-start gap-2 rounded-md px-2 py-1.5 border ${
                  reached
                    ? `${track.textColor} border-border/60 bg-black/20`
                    : "text-muted-foreground border-border/30 bg-background/20 opacity-60"
                }`}
              >
                <span className="font-bold text-[11px] w-12">NV {m.level}</span>
                <span className="text-[11px] tabular-nums w-12">
                  {track.statLabel.charAt(0)}:{m.threshold}
                </span>
                <span className="text-[11px]">
                  {m.summary}
                  {m.unlock && <span className="ml-1 text-amber-400">· {m.unlock}</span>}
                </span>
                <span className="text-[10px] tabular-nums whitespace-nowrap">{m.staminaCost} St</span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

export function HakiProgressionPanel({ character, haki }: { character: CharacterInput; haki: Record<string, boolean> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-lg text-primary text-glow">
          Progressão de Haki
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Cada Haki evolui de NV 1 a NV 10 conforme o stat correspondente sobe. O nível atual já leva em conta
        o seu valor de Vigor, Astúcia e Espírito da ficha.
      </p>
      <div className="grid gap-4">
        {HAKI_TRACKS.map((track) => (
          <HakiProgressionTrack
            key={track.id}
            track={track}
            character={character}
            isUnlocked={!!haki[`${track.id}Unlocked`]}
          />
        ))}
      </div>
    </div>
  );
}

export function AkumaProgressionPanel({
  character,
  fruitType,
}: {
  character: CharacterInput;
  fruitType: FruitType | null | undefined;
}) {
  const spirit = getStat(character, "spirit");
  const { level, current, next } = getAkumaLevel(spirit);
  const max = AKUMA_GENERAL[AKUMA_GENERAL.length - 1].spirit;
  const pct = Math.min(100, (spirit / max) * 100);
  const typeMilestones = fruitType ? AKUMA_TYPE[fruitType] : null;
  const typeUnlocked = typeMilestones?.filter((tm) => tm.level <= level) ?? [];
  const typeNext = typeMilestones?.find((tm) => tm.level > level);

  return (
    <div className="rounded-xl border border-purple-700/50 bg-purple-950/20 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍎</span>
          <div>
            <p className="font-bold text-purple-300">Progressão da Akuma no Mi</p>
            <p className="text-[11px] text-muted-foreground tracking-wider uppercase">
              Despertar pela vontade · Espírito
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Espírito</div>
          <div className="font-display font-bold text-2xl text-purple-300">{spirit}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-black/40 text-purple-300">
            Nível Atual
          </span>
          <span className="font-display font-bold text-lg text-purple-300">NV {level} / 10</span>
        </div>
        {current.staminaCost !== null && (
          <div className="text-xs text-muted-foreground">
            Custo de uso atual:{" "}
            <span className="font-bold text-purple-300">{current.staminaCost} Stamina</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500/70 to-purple-300 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground tracking-wider uppercase">
          <span>{spirit} Espírito</span>
          {next ? <span>Faltam {next.spirit - spirit} para NV {next.level}</span> : <span className="text-purple-300 font-bold">DESPERTAR ATINGIDO</span>}
        </div>
      </div>

      <div className="bg-black/30 border border-border/60 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
          Destrava atual (geral)
        </p>
        <p className="text-sm text-purple-200 font-semibold">{current.unlock}</p>
      </div>

      {next && (
        <div className="border border-dashed border-border/60 rounded-lg p-3 bg-background/30">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            Próximo marco — NV {next.level} (Espírito {next.spirit})
          </p>
          <p className="text-sm text-foreground/90 mt-1">{next.unlock}</p>
        </div>
      )}

      {typeMilestones && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Evolução específica de {fruitType}
          </p>
          {typeUnlocked.map((tm) => (
            <div key={tm.level} className="rounded-md px-3 py-2 bg-purple-950/40 border border-purple-700/40 text-purple-100 text-xs flex gap-2">
              <span className="font-bold text-purple-300 whitespace-nowrap">NV {tm.level}</span>
              <span>{tm.unlock}</span>
            </div>
          ))}
          {typeNext && (
            <div className="rounded-md px-3 py-2 border border-dashed border-purple-700/40 text-muted-foreground text-xs flex gap-2">
              <span className="font-bold whitespace-nowrap">NV {typeNext.level}</span>
              <span>{typeNext.unlock}</span>
            </div>
          )}
        </div>
      )}

      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
          Ver tabela completa (geral)
        </summary>
        <div className="mt-3 space-y-2">
          {AKUMA_GENERAL.map((m) => {
            const reached = spirit >= m.spirit;
            return (
              <div
                key={m.level}
                className={`grid grid-cols-[auto_auto_1fr_auto] items-start gap-2 rounded-md px-2 py-1.5 border ${
                  reached
                    ? "text-purple-200 border-border/60 bg-black/20"
                    : "text-muted-foreground border-border/30 bg-background/20 opacity-60"
                }`}
              >
                <span className="font-bold text-[11px] w-12">NV {m.level}</span>
                <span className="text-[11px] tabular-nums w-12">E:{m.spirit}</span>
                <span className="text-[11px]">{m.unlock}</span>
                <span className="text-[10px] tabular-nums whitespace-nowrap">
                  {m.staminaCost === null ? "passivo" : `${m.staminaCost} St`}
                </span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
