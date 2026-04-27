import type { FruitType, HakiId } from "./powers-data";

// ─── Haki Progression ────────────────────────────────────────────────

export interface HakiMilestone {
  level: number;
  threshold: number;
  summary: string;
  unlock?: string;
  staminaCost: number;
}

export interface HakiTrack {
  id: HakiId;
  name: string;
  subtitle: string;
  icon: string;
  statKey: "vigor" | "cunning" | "spirit";
  statLabel: string;
  step: number;
  color: string;
  textColor: string;
  milestones: HakiMilestone[];
}

export const HAKI_TRACKS: HakiTrack[] = [
  {
    id: "armamento",
    name: "Haki de Armamento",
    subtitle: "Busoshoku · Vigor",
    icon: "🛡️",
    statKey: "vigor",
    statLabel: "Vigor",
    step: 10,
    color: "border-gray-600/60 bg-gray-950/30",
    textColor: "text-gray-300",
    milestones: [
      { level: 1, threshold: 10, summary: "+1d6 dano físico. Permite ferir Logias.", staminaCost: 5 },
      { level: 2, threshold: 20, summary: "+2 em testes de Força para bloqueios.", staminaCost: 5 },
      { level: 3, threshold: 30, summary: "Bônus de dano sobe para +1d8.", staminaCost: 5 },
      { level: 4, threshold: 40, summary: "Pode imbuir armas pequenas (facas, flechas, balas).", staminaCost: 5 },
      { level: 5, threshold: 50, summary: "+1d10 dano e +5 Defesa Física.", unlock: "Koka — Endurecimento Negro", staminaCost: 10 },
      { level: 6, threshold: 60, summary: "Resistência Elemental: reduz dano de fogo/gelo em 2.", staminaCost: 10 },
      { level: 7, threshold: 70, summary: "Bônus de dano sobe para +1d12.", staminaCost: 10 },
      { level: 8, threshold: 80, summary: "Bônus de Defesa Física do NV 5 sobe para +8.", staminaCost: 15 },
      { level: 9, threshold: 90, summary: "Concentração: pode manter o Haki ativo fora de combate.", staminaCost: 15 },
      { level: 10, threshold: 100, summary: "+1d20 dano. Ignora RD e Armadura do alvo.", unlock: "Ryou — Fluxo / Dano Interno", staminaCost: 20 },
    ],
  },
  {
    id: "observacao",
    name: "Haki de Observação",
    subtitle: "Kenbunshoku · Astúcia",
    icon: "👁️",
    statKey: "cunning",
    statLabel: "Astúcia",
    step: 10,
    color: "border-blue-700/60 bg-blue-950/30",
    textColor: "text-blue-300",
    milestones: [
      { level: 1, threshold: 10, summary: "+4 em Esquiva/Agilidade. Permite prever movimentos.", staminaCost: 5 },
      { level: 2, threshold: 20, summary: "Sente seres vivos em raio de 10 metros.", staminaCost: 5 },
      { level: 3, threshold: 30, summary: "Bônus de Esquiva sobe para +6.", staminaCost: 5 },
      { level: 4, threshold: 40, summary: "Identifica o nível de poder aproximado do oponente.", staminaCost: 5 },
      { level: 5, threshold: 50, summary: "+8 Esquiva. Imune a flanqueamento e surpresa.", unlock: "Sentir Intenção — Voz de Todas as Coisas", staminaCost: 10 },
      { level: 6, threshold: 60, summary: "Alcance expandido: presenças em até 100 metros.", staminaCost: 10 },
      { level: 7, threshold: 70, summary: "Bônus de Esquiva sobe para +10.", staminaCost: 10 },
      { level: 8, threshold: 80, summary: "Identifica fraquezas: +2 margem de Crítico no próximo ataque.", staminaCost: 15 },
      { level: 9, threshold: 90, summary: "Radar Emocional: sente mentiras e estado mental dos NPCs.", staminaCost: 15 },
      { level: 10, threshold: 100, summary: "+1d20 em Esquiva. Age antes de qualquer um na rodada.", unlock: "Visão do Futuro", staminaCost: 20 },
    ],
  },
  {
    id: "haoshoku",
    name: "Haki do Conquistador",
    subtitle: "Haoshoku · Espírito",
    icon: "👑",
    statKey: "spirit",
    statLabel: "Espírito",
    step: 20,
    color: "border-yellow-700/60 bg-yellow-950/30",
    textColor: "text-yellow-300",
    milestones: [
      { level: 1, threshold: 20, summary: "Teste Espírito vs Vigor para desmaiar inimigos fracos.", staminaCost: 50 },
      { level: 2, threshold: 40, summary: "Aumenta a dificuldade do teste de resistência dos inimigos.", staminaCost: 50 },
      { level: 3, threshold: 60, summary: "Precisão do Rei: pode escolher alvos para não serem afetados.", staminaCost: 50 },
      { level: 4, threshold: 80, summary: "Domínio de Área: raio de efeito sobe para 20 metros.", staminaCost: 50 },
      { level: 5, threshold: 100, summary: "Inimigos que resistirem recebem -2 em todos os dados.", staminaCost: 75 },
      { level: 6, threshold: 120, summary: "Intimidação: monstros e animais selvagens recuam ou obedecem.", staminaCost: 75 },
      { level: 7, threshold: 140, summary: "Pressão Física: dano em objetos e -4 Stats em inimigos fortes (2 rodadas).", staminaCost: 100 },
      { level: 8, threshold: 160, summary: "Presença Esmagadora: inimigos afetados perdem 10 de Stamina por turno.", staminaCost: 150 },
      { level: 9, threshold: 180, summary: "Aura Suprema: custo de outros Hakis ativos é reduzido pela metade.", staminaCost: 150 },
      { level: 10, threshold: 200, summary: "Revestimento de Rei: +1d20 dano extra. Combina com Armamento.", unlock: "Despertar do Conquistador", staminaCost: 200 },
    ],
  },
];

export function getHakiLevel(stat: number, track: HakiTrack): { level: number; current?: HakiMilestone; next?: HakiMilestone } {
  let current: HakiMilestone | undefined;
  let next: HakiMilestone | undefined;
  for (const m of track.milestones) {
    if (stat >= m.threshold) current = m;
    else { next = m; break; }
  }
  return { level: current?.level ?? 0, current, next };
}

export function getHakiTrack(id: HakiId): HakiTrack {
  return HAKI_TRACKS.find((t) => t.id === id)!;
}

// ─── Akuma no Mi Progression ─────────────────────────────────────────

export interface AkumaMilestone {
  level: number;
  spirit: number;
  unlock: string;
  staminaCost: number | null;
}

export const AKUMA_GENERAL: AkumaMilestone[] = [
  { level: 1, spirit: 0, unlock: "Passiva: propriedade do corpo ou forma inicial.", staminaCost: 0 },
  { level: 2, spirit: 10, unlock: "Habilidade Básica: primeiro ataque ou uso ativo.", staminaCost: 5 },
  { level: 3, spirit: 15, unlock: "Mobilidade: dash, voo ou salto elemental/corporal.", staminaCost: 10 },
  { level: 4, spirit: 20, unlock: "Defesa/Utilidade: escudos, bloqueios ou criação de itens.", staminaCost: 10 },
  { level: 5, spirit: 25, unlock: "Ataque em Área: golpe que atinge múltiplos alvos.", staminaCost: 15 },
  { level: 6, spirit: 30, unlock: "Maestria: reduz custo das habilidades NV 2 e 3 em -2.", staminaCost: null },
  { level: 7, spirit: 35, unlock: "Forma Superior: transformação de combate (ex: Gears).", staminaCost: 20 },
  { level: 8, spirit: 40, unlock: "Técnica Suprema: o golpe mais forte antes do despertar.", staminaCost: 30 },
  { level: 9, spirit: 45, unlock: "Resistência: pode usar a fruta mesmo com 1 de HP.", staminaCost: null },
  { level: 10, spirit: 50, unlock: "DESPERTAR: transforma o ambiente. Bônus de 1d20.", staminaCost: 50 },
];

export interface AkumaTypeMilestone {
  level: number;
  unlock: string;
}

export const AKUMA_TYPE: Record<FruitType, AkumaTypeMilestone[]> = {
  Zoan: [
    { level: 1, unlock: "Formas Iniciais: alterna Humana, Animal e Híbrida. Bônus passivo de Vigor transformado." },
    { level: 3, unlock: "Instinto Animal: sentidos aguçados (olfato/audição) + ataque característico." },
    { level: 5, unlock: "Resiliência Zoan: regeneração passiva por turno." },
    { level: 8, unlock: "Forma Desperta/Monstruosa: tamanho e stats físicos drasticamente maiores. Custo reduzido." },
    { level: 10, unlock: "Mestre das Formas: bônus de Espírito vira 1d20 em qualquer teste físico. Imortalidade momentânea (sobrevive a 1 golpe letal por cena)." },
  ],
  Paramecia: [
    { level: 1, unlock: "Propriedade Corporal: corpo ganha a característica da fruta. Imunidade a danos específicos." },
    { level: 3, unlock: "Projeção: aprende a exteriorizar o poder (ataques à distância, criação de objetos)." },
    { level: 5, unlock: "Controle de Área: habilidades que afetam o campo de batalha ou múltiplos alvos." },
    { level: 8, unlock: "Técnica Suprema: habilidade de alto custo de Stamina, o trunfo do usuário." },
    { level: 10, unlock: "Despertar: transforma o ambiente na propriedade da fruta. +1d20 em manipulação de cenário." },
  ],
  Logia: [
    { level: 1, unlock: "Intangibilidade Reativa: torna-se o elemento. Ataques sem Haki passam por ele." },
    { level: 3, unlock: "Deslocamento Elemental: voo ou alta velocidade usando o elemento." },
    { level: 5, unlock: "Bombardeio: ataques de larga escala cobrindo o campo com o elemento." },
    { level: 8, unlock: "Estado de Logia Pura: custo de intangibilidade cai a 0. Pode se fundir com o ambiente." },
    { level: 10, unlock: "Alteração Climática: altera permanentemente o clima da ilha enquanto presente. +1d20 em dano elemental." },
  ],
};

export function getAkumaLevel(spirit: number): { level: number; current: AkumaMilestone; next?: AkumaMilestone } {
  let current = AKUMA_GENERAL[0];
  let next: AkumaMilestone | undefined;
  for (const m of AKUMA_GENERAL) {
    if (spirit >= m.spirit) current = m;
    else { next = m; break; }
  }
  return { level: current.level, current, next };
}

export function getAkumaUseCost(spirit: number, mastery: number): number {
  const { level, current } = getAkumaLevel(spirit);
  let base = current.staminaCost ?? 10;
  // NV6 destrava Maestria: reduz custo de NV 2 e 3 em -2.
  // Aqui aplicamos uma redução pequena adicional baseada no nível e mastery%.
  if (level >= 6) base = Math.max(1, base - 2);
  if (mastery >= 50) base = Math.max(1, base - 1);
  if (mastery >= 90) base = Math.max(1, base - 1);
  return base;
}
