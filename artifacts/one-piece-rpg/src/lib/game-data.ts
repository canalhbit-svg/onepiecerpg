export const ORIGINS = [
  "East Blue",
  "West Blue",
  "North Blue",
  "South Blue",
  "Grand Line",
  "Novo Mundo",
  "Skypiea",
  "Fishman Island",
  "Wano"
] as const;

export const SPECIALTIES = [
  "Combatente",
  "Espadachim",
  "Atirador",
  "Navegador",
  "Cozinheiro",
  "Médico",
  "Músico",
  "Arqueólogo",
  "Ladrão"
] as const;

export type AttributeKey = 'vigor' | 'agility' | 'cunning' | 'charisma' | 'spirit';
export type DiceType = 'd4' | 'd6' | 'd10' | 'd20';

export const ATTRIBUTES: { key: AttributeKey; label: string; icon: string }[] = [
  { key: 'vigor', label: 'Vigor', icon: '💪' },
  { key: 'agility', label: 'Agilidade', icon: '⚡' },
  { key: 'cunning', label: 'Astúcia', icon: '🧠' },
  { key: 'charisma', label: 'Carisma', icon: '✨' },
  { key: 'spirit', label: 'Espírito', icon: '🔥' },
];

export const DICE_COSTS: Record<DiceType, number> = {
  d4: 1,
  d6: 2,
  d10: 4,
  d20: 10,
};

export const ORIGIN_BONUSES: Record<string, { attr: AttributeKey, dice: DiceType }> = {
  "East Blue": { attr: "vigor", dice: "d4" },
  "West Blue": { attr: "cunning", dice: "d4" },
  "North Blue": { attr: "charisma", dice: "d4" },
  "South Blue": { attr: "agility", dice: "d4" },
  "Grand Line": { attr: "spirit", dice: "d4" },
  "Novo Mundo": { attr: "vigor", dice: "d6" },
  "Skypiea": { attr: "spirit", dice: "d4" },
  "Fishman Island": { attr: "agility", dice: "d6" },
  "Wano": { attr: "cunning", dice: "d6" },
};

export const ORIGIN_ADVANTAGES: Record<string, { title: string; description: string }> = {
  "East Blue": {
    title: "Contatos de Porto",
    description: "Paga metade do preço em estadias e consertos básicos em qualquer porto."
  },
  "West Blue": {
    title: "Conhecimento do Submundo",
    description: "Sabe onde encontrar mercados negros e informações ilegais em qualquer ilha."
  },
  "North Blue": {
    title: "Aristocracia / Fama",
    description: "Começa com +5.000 ฿ extras e tem facilidade em lidar com autoridades e nobres."
  },
  "South Blue": {
    title: "Herança de Engenharia",
    description: "Começa com 1 item tecnológico raro ou ferramenta de precisão."
  },
  "Grand Line": {
    title: "Veterano das Grandes Rotas",
    description: "Ignora a primeira penalidade climática de rota em cada sessão."
  },
  "Novo Mundo": {
    title: "Sobrevivente do Caos",
    description: "+2 de Vida Máxima e imune ao primeiro status negativo de cada sessão."
  },
  "Skypiea": {
    title: "Afinidade com o Vento",
    description: "Pode usar Espírito ao invés de Agilidade em testes de movimentação aérea."
  },
  "Fishman Island": {
    title: "Mestre das Profundezas",
    description: "Nada duas vezes mais rápido e pode prender a respiração por 10 minutos."
  },
  "Wano": {
    title: "Código Bushido",
    description: "Recebe um bônus de +1d4 extra em qualquer rolagem quando está protegendo aliados."
  },
};

export const SPECIALTY_BONUSES: Record<string, { attr: AttributeKey, dice: DiceType }> = {
  "Combatente": { attr: "vigor", dice: "d4" },
  "Espadachim": { attr: "agility", dice: "d4" },
  "Atirador": { attr: "agility", dice: "d4" },
  "Navegador": { attr: "cunning", dice: "d4" },
  "Cozinheiro": { attr: "cunning", dice: "d4" },
  "Médico": { attr: "cunning", dice: "d4" },
  "Músico": { attr: "charisma", dice: "d4" },
  "Arqueólogo": { attr: "cunning", dice: "d4" },
  "Ladrão": { attr: "agility", dice: "d4" },
};

export const SPECIALTY_PERKS: Record<string, { title: string; description: string }> = {
  "Combatente": {
    title: "Instinto de Luta",
    description: "Dano desarmado base vira 1d6 (em vez de 1d4) e +2 de Vida Máxima automático."
  },
  "Espadachim": {
    title: "Arte da Lâmina",
    description: "Usa Agilidade para cortar madeira, cordas e materiais resistentes com precisão cirúrgica."
  },
  "Atirador": {
    title: "Olho de Falcão",
    description: "Usa Agilidade para ataques à distância com qualquer arma de longa distância."
  },
  "Navegador": {
    title: "Sentido de Rota",
    description: "Rola 2 dados e usa o maior em testes de Astúcia para navegação e clima."
  },
  "Cozinheiro": {
    title: "Preparar Refeição",
    description: "1x por dia: prepara uma refeição que cura 1d6 de Vida de todos no grupo."
  },
  "Médico": {
    title: "Arte da Cura",
    description: "Usa Astúcia para estancar sangramentos e curar ferimentos que outros não conseguiriam."
  },
  "Músico": {
    title: "Alma da Tripulação",
    description: "+2 de Carisma em testes de moral do grupo. Pode tocar para recuperar 1d4 de espírito."
  },
  "Arqueólogo": {
    title: "Decifrador de Segredos",
    description: "Pode ler poneglyphs e identificar artefatos raros. +1d4 em testes de conhecimento."
  },
  "Ladrão": {
    title: "Sombra Sorrateira",
    description: "Vantagem (rola 2, pega maior) em testes de Agilidade para furtividade e furtos."
  },
};

export interface InventoryItemDef {
  id: string;
  name: string;
  type: "weapon" | "consumable" | "tool";
  damage?: string;
  attribute?: string;
  effect?: string;
  quantity: number;
  equipped: boolean;
}

export const SPECIALTY_STARTER_KITS: Record<string, InventoryItemDef> = {
  "Combatente": {
    id: "starter-combatente",
    name: "Faixas de Treino",
    type: "weapon",
    damage: "1d6",
    attribute: "vigor",
    effect: "Soco reforçado — dano desarmado base aumentado.",
    quantity: 1,
    equipped: false,
  },
  "Espadachim": {
    id: "starter-espadachim",
    name: "Katana de Ferro",
    type: "weapon",
    damage: "1d6",
    attribute: "agility",
    effect: "Lâmina sólida, forjada para durar.",
    quantity: 1,
    equipped: false,
  },
  "Atirador": {
    id: "starter-atirador",
    name: "Estilingue de Precisão",
    type: "weapon",
    damage: "1d4",
    attribute: "agility",
    effect: "Ataque à distância. Usa Agilidade.",
    quantity: 1,
    equipped: false,
  },
  "Navegador": {
    id: "starter-navegador",
    name: "Bússola Básica",
    type: "tool",
    effect: "+2 em testes de Astúcia para navegação e orientação.",
    quantity: 1,
    equipped: false,
  },
  "Cozinheiro": {
    id: "starter-cozinheiro",
    name: "Faca de Chef",
    type: "weapon",
    damage: "1d4",
    attribute: "cunning",
    effect: "Afiada e versátil. Auxílio em preparo de Provisões.",
    quantity: 1,
    equipped: false,
  },
  "Médico": {
    id: "starter-medico",
    name: "Kit de Primeiros Socorros",
    type: "consumable",
    damage: "1d4",
    effect: "Cura 1d4 de Vida. Estanca sangramentos. (Consome 1 uso)",
    quantity: 3,
    equipped: false,
  },
  "Músico": {
    id: "starter-musico",
    name: "Instrumento Rústico",
    type: "tool",
    effect: "Usa Carisma para tocar. Recupera 1d4 Espírito do grupo.",
    quantity: 1,
    equipped: false,
  },
  "Arqueólogo": {
    id: "starter-arqueologo",
    name: "Diário de Campo",
    type: "tool",
    effect: "+1d4 em testes de Astúcia para identificar artefatos e decifrar textos antigos.",
    quantity: 1,
    equipped: false,
  },
  "Ladrão": {
    id: "starter-ladrao",
    name: "Kit de Ladrão",
    type: "tool",
    effect: "Ferramentas de arrombamento. Vantagem em testes de furtividade e destreza.",
    quantity: 1,
    equipped: false,
  },
};

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  type: "weapon" | "consumable" | "tool";
  damage?: string;
  attribute?: string;
  effect?: string;
  icon: string;
  category: string;
}

export const MARKET_CATALOG: MarketItem[] = [
  // Weapons
  {
    id: "market-espada-treino",
    name: "Espada de Treino",
    price: 300,
    type: "weapon",
    damage: "1d6",
    attribute: "agility",
    icon: "⚔️",
    category: "Armas",
  },
  {
    id: "market-katana",
    name: "Katana de Qualidade",
    price: 1500,
    type: "weapon",
    damage: "1d10",
    attribute: "agility",
    icon: "🗡️",
    category: "Armas",
  },
  {
    id: "market-pistola",
    name: "Pistola de Pederneira",
    price: 2000,
    type: "weapon",
    damage: "1d10",
    attribute: "agility",
    effect: "Pontaria — ataque à distância.",
    icon: "🔫",
    category: "Armas",
  },
  {
    id: "market-mosquete",
    name: "Mosquete da Marinha",
    price: 3500,
    type: "weapon",
    damage: "1d20",
    attribute: "agility",
    effect: "Pontaria — alto alcance, dano devastador.",
    icon: "🎯",
    category: "Armas",
  },
  // Consumables
  {
    id: "market-provisoes",
    name: "Provisões (1 semana)",
    price: 100,
    type: "consumable",
    damage: undefined,
    effect: "Cura 2 de Vida. Requer Astúcia/Cozinha para preparo.",
    icon: "🍖",
    category: "Suprimentos",
  },
  {
    id: "market-kit-medico",
    name: "Kit Médico",
    price: 500,
    type: "consumable",
    damage: "1d6",
    effect: "Cura 1d6 de Vida. Requer Astúcia/Medicina.",
    icon: "🩺",
    category: "Suprimentos",
  },
  // Tools
  {
    id: "market-luneta",
    name: "Luneta de Marinheiro",
    price: 800,
    type: "tool",
    effect: "+1d4 em testes de Astúcia para avistar perigos e navegar.",
    icon: "🔭",
    category: "Ferramentas",
  },
  {
    id: "market-bussola",
    name: "Bússola Log Pose",
    price: 1200,
    type: "tool",
    effect: "Essencial na Grand Line. Revela a rota para a próxima ilha.",
    icon: "🧭",
    category: "Ferramentas",
  },
];
