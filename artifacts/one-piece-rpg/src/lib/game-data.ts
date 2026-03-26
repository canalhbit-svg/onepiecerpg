export const ORIGINS = [
  "East Blue",
  "West Blue",
  "North Blue",
  "South Blue",
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
  // ⚔️ Armas e Combate (15 itens)
  {
    id: "market-faca-arremesso",
    name: "Faca de Arremesso",
    price: 200,
    type: "weapon",
    damage: "1d4",
    attribute: "agility",
    effect: "Leve e precisa. Ideal para ataques à distância curta.",
    icon: "🔪",
    category: "Armas",
  },
  {
    id: "market-adaga-aco",
    name: "Adaga de Aço",
    price: 500,
    type: "weapon",
    damage: "1d6",
    attribute: "agility",
    effect: "Lâmina curta de aço temperado.",
    icon: "🗡️",
    category: "Armas",
  },
  {
    id: "market-cimitarra",
    name: "Cimitarra",
    price: 1200,
    type: "weapon",
    damage: "1d8",
    attribute: "agility",
    effect: "Lâmina curva de origem exótica.",
    icon: "⚔️",
    category: "Armas",
  },
  {
    id: "market-machado-batalha",
    name: "Machado de Batalha",
    price: 1800,
    type: "weapon",
    damage: "1d10",
    attribute: "vigor",
    effect: "Golpe devastador. Usa a força bruta do usuário.",
    icon: "🪓",
    category: "Armas",
  },
  {
    id: "market-martelo-guerra",
    name: "Martelo de Guerra",
    price: 2200,
    type: "weapon",
    damage: "1d12",
    attribute: "vigor",
    effect: "Esmagador. Ignora 1 ponto de armadura do oponente.",
    icon: "🔨",
    category: "Armas",
  },
  {
    id: "market-lanca-ferro",
    name: "Lança de Ferro",
    price: 1000,
    type: "weapon",
    damage: "1d8",
    attribute: "agility",
    effect: "Alcance — pode atacar sem adjacência no combate.",
    icon: "🏹",
    category: "Armas",
  },
  {
    id: "market-besta-mao",
    name: "Besta de Mão",
    price: 2500,
    type: "weapon",
    damage: "1d10",
    attribute: "agility",
    effect: "Pontaria — ataque à distância silencioso.",
    icon: "🎯",
    category: "Armas",
  },
  {
    id: "market-arco-longo",
    name: "Arco Longo",
    price: 1800,
    type: "weapon",
    damage: "1d8",
    attribute: "agility",
    effect: "Pontaria — longo alcance. Usa Agilidade.",
    icon: "🏹",
    category: "Armas",
  },
  {
    id: "market-chicote-couro",
    name: "Chicote de Couro",
    price: 600,
    type: "weapon",
    damage: "1d4",
    attribute: "charisma",
    effect: "Intimidação — pode desarmar ou prender oponentes.",
    icon: "🪢",
    category: "Armas",
  },
  {
    id: "market-soqueira-bronze",
    name: "Soqueira de Bronze",
    price: 400,
    type: "weapon",
    damage: "1d4",
    attribute: "vigor",
    effect: "+2 no dano desarmado. Veste na mão.",
    icon: "🥊",
    category: "Armas",
  },
  {
    id: "market-espada-cavalaria",
    name: "Espada Longa de Cavalaria",
    price: 3000,
    type: "weapon",
    damage: "1d12",
    attribute: "agility",
    effect: "Lâmina de elite. Equilibrio perfeito entre velocidade e dano.",
    icon: "⚔️",
    category: "Armas",
  },
  {
    id: "market-rifle-precisao",
    name: "Rifle de Precisão",
    price: 5500,
    type: "weapon",
    damage: "1d20",
    attribute: "agility",
    effect: "Pontaria / Longo Alcance — devastador a distâncias extremas.",
    icon: "🔫",
    category: "Armas",
  },
  {
    id: "market-bomba-fumaca",
    name: "Bomba de Fumaça (x3)",
    price: 900,
    type: "consumable",
    effect: "Fuga automática ou Vantagem em testes de Furtividade. Consumível.",
    icon: "💨",
    category: "Armas",
  },
  {
    id: "market-granada-polvora",
    name: "Granada de Pólvora",
    price: 1500,
    type: "consumable",
    damage: "1d20",
    effect: "Dano em Área — afeta todos no raio. Consumível.",
    icon: "💣",
    category: "Armas",
  },
  {
    id: "market-escudo-madeira",
    name: "Escudo de Madeira",
    price: 800,
    type: "tool",
    attribute: "vigor",
    effect: "+2 de Defesa quando equipado.",
    icon: "🛡️",
    category: "Armas",
  },

  // 🛡️ Vestuário e Proteção (10 itens)
  {
    id: "market-capa-viagem",
    name: "Capa de Viagem",
    price: 150,
    type: "tool",
    effect: "Proteção contra Chuva e Frio extremo.",
    icon: "🧥",
    category: "Vestuário",
  },
  {
    id: "market-armadura-couro",
    name: "Armadura de Couro",
    price: 1200,
    type: "tool",
    effect: "+1 de Defesa. Leve o suficiente para não penalizar movimentação.",
    icon: "🥋",
    category: "Vestuário",
  },
  {
    id: "market-colete-malha",
    name: "Colete de Malha de Ferro",
    price: 3500,
    type: "tool",
    effect: "+3 de Defesa. -1 em Agilidade (peso).",
    icon: "🛡️",
    category: "Vestuário",
  },
  {
    id: "market-botas-escalada",
    name: "Botas de Escalada",
    price: 500,
    type: "tool",
    effect: "+2 em testes de Agilidade para Escalar superfícies.",
    icon: "👢",
    category: "Vestuário",
  },
  {
    id: "market-luvas-gatuno",
    name: "Luvas de Gatuno",
    price: 700,
    type: "tool",
    attribute: "cunning",
    effect: "+2 em Astúcia para Mãos Leves e furtos discretos.",
    icon: "🧤",
    category: "Vestuário",
  },
  {
    id: "market-sobretudo-capitao",
    name: "Sobretudo de Capitão",
    price: 2000,
    type: "tool",
    attribute: "charisma",
    effect: "+2 em Carisma para testes de Persuasão e liderança.",
    icon: "🪭",
    category: "Vestuário",
  },
  {
    id: "market-mascara-gas",
    name: "Máscara de Gás",
    price: 1500,
    type: "tool",
    effect: "Imune a Venenos Inaláveis e gases tóxicos.",
    icon: "😷",
    category: "Vestuário",
  },
  {
    id: "market-oculos-mergulho",
    name: "Óculos de Mergulho",
    price: 400,
    type: "tool",
    effect: "Visão clara sob a água. Remove penalidade de combate aquático.",
    icon: "🥽",
    category: "Vestuário",
  },
  {
    id: "market-cinto-utilidades",
    name: "Cinto de Utilidades",
    price: 1000,
    type: "tool",
    effect: "Carrega até +5 itens extras sem ocupar espaço na mochila.",
    icon: "🎒",
    category: "Vestuário",
  },
  {
    id: "market-chapeu-palha",
    name: "Chapéu de Palha Estruturado",
    price: 50,
    type: "tool",
    effect: "Estilo inigualável. Indestrutível. Símbolo de liberdade.",
    icon: "👒",
    category: "Vestuário",
  },

  // 🧭 Navegação e Ferramentas (10 itens)
  {
    id: "market-log-pose",
    name: "Log Pose (Grand Line)",
    price: 5000,
    type: "tool",
    effect: "Essencial para navegar na Grand Line. Aponta para a próxima ilha.",
    icon: "🧭",
    category: "Navegação",
  },
  {
    id: "market-eternal-pose",
    name: "Eternal Pose (Ilha Específica)",
    price: 15000,
    type: "tool",
    effect: "Aponta permanentemente para uma única ilha específica.",
    icon: "🗺️",
    category: "Navegação",
  },
  {
    id: "market-bussola-magnetica",
    name: "Bússola Magnética",
    price: 1200,
    type: "tool",
    attribute: "cunning",
    effect: "+2 em Astúcia para testes de Navegação e orientação.",
    icon: "🧲",
    category: "Navegação",
  },
  {
    id: "market-telescopio-bronze",
    name: "Telescópio de Bronze",
    price: 1500,
    type: "tool",
    effect: "Enxerga navios e ilhas a até 10km. +1d4 em Vigilância.",
    icon: "🔭",
    category: "Navegação",
  },
  {
    id: "market-mapa-blue-sea",
    name: "Mapa do Blue Sea",
    price: 500,
    type: "tool",
    effect: "Revela rotas comerciais e portos das Blue Seas.",
    icon: "📜",
    category: "Navegação",
  },
  {
    id: "market-kit-reparacao",
    name: "Kit de Reparação de Casco",
    price: 2000,
    type: "consumable",
    effect: "Cura 20 pontos de Vida do Navio. Consumível.",
    icon: "🔧",
    category: "Navegação",
  },
  {
    id: "market-verniz-madeira",
    name: "Verniz para Madeira",
    price: 800,
    type: "consumable",
    effect: "+5 de Defesa do Navio (Temporário — dura 1 sessão).",
    icon: "🪣",
    category: "Navegação",
  },
  {
    id: "market-ancoradouro-portatil",
    name: "Ancoradouro Portátil",
    price: 1200,
    type: "tool",
    effect: "Permite atracar em qualquer costa, mesmo sem porto.",
    icon: "⚓",
    category: "Navegação",
  },
  {
    id: "market-sinaleiro-luz",
    name: "Sinaleiro de Luz",
    price: 300,
    type: "tool",
    effect: "Comunicação à distância via sinais de luz. Alcance: 5km.",
    icon: "💡",
    category: "Navegação",
  },
  {
    id: "market-corda-canhamo",
    name: "Corda de Cânhamo (20m)",
    price: 100,
    type: "tool",
    effect: "Resistente. Suporta até 300kg. Essencial para escaladas.",
    icon: "🪢",
    category: "Navegação",
  },

  // 🍱 Consumíveis e Medicina (10 itens)
  {
    id: "market-racao-seca",
    name: "Ração Seca (1 dia)",
    price: 20,
    type: "consumable",
    effect: "Recupera 1 de Vida. Mantém o bando em marcha.",
    icon: "🥫",
    category: "Suprimentos",
  },
  {
    id: "market-sake",
    name: "Garrafa de Saquê",
    price: 150,
    type: "consumable",
    effect: "+2 Carisma em situações sociais. -2 Agilidade até o fim da cena.",
    icon: "🍶",
    category: "Suprimentos",
  },
  {
    id: "market-antidoto-universal",
    name: "Antídoto Universal",
    price: 1000,
    type: "consumable",
    effect: "Cura Envenenamento e remove efeitos tóxicos.",
    icon: "💊",
    category: "Suprimentos",
  },
  {
    id: "market-erva-medicinal",
    name: "Erva Medicinal",
    price: 300,
    type: "consumable",
    damage: "1d4",
    effect: "Cura 1d4 de Vida. Natural e de fácil acesso.",
    icon: "🌿",
    category: "Suprimentos",
  },
  {
    id: "market-tonico-energia",
    name: "Tônico de Energia",
    price: 800,
    type: "consumable",
    effect: "Ignora penalidade de Cansaço por 1 hora.",
    icon: "⚡",
    category: "Suprimentos",
  },
  {
    id: "market-especiarias-exoticas",
    name: "Especiarias Exóticas",
    price: 500,
    type: "consumable",
    effect: "Melhora a cura do Cozinheiro em +2 de Vida na próxima refeição.",
    icon: "🫙",
    category: "Suprimentos",
  },
  {
    id: "market-bandagens",
    name: "Bandagens Limpas",
    price: 100,
    type: "consumable",
    effect: "Estanca Sangramento. Estabiliza personagem a 0 de Vida.",
    icon: "🩹",
    category: "Suprimentos",
  },
  {
    id: "market-vitamina-c",
    name: "Vitamina C (Anti-Escorbuto)",
    price: 200,
    type: "consumable",
    effect: "Mantém o bando saudável em longas travessias marítimas.",
    icon: "🍋",
    category: "Suprimentos",
  },
  {
    id: "market-carne-rei-mares",
    name: "Carne de Rei dos Mares",
    price: 2500,
    type: "consumable",
    effect: "Cura 50% da Vida Máxima. Um banquete lendário.",
    icon: "🥩",
    category: "Suprimentos",
  },
  {
    id: "market-agua-potavel",
    name: "Água Potável (Galão)",
    price: 50,
    type: "consumable",
    effect: "Sobrevivência essencial. Evita Desidratação em rotas longas.",
    icon: "💧",
    category: "Suprimentos",
  },

  // 💎 Itens Raros e Diversos (5 itens)
  {
    id: "market-den-den-mushi-comum",
    name: "Den Den Mushi Comum",
    price: 10000,
    type: "tool",
    effect: "Comunicação por rádio com qualquer Den Den Mushi pareado.",
    icon: "🐌",
    category: "Raros",
  },
  {
    id: "market-den-den-mushi-visual",
    name: "Den Den Mushi Visual",
    price: 25000,
    type: "tool",
    effect: "Transmissão de vídeo ao vivo. Usado pela Marinha e grandes piratas.",
    icon: "📡",
    category: "Raros",
  },
  {
    id: "market-dial-impacto",
    name: "Dial de Impacto (Skypiea)",
    price: 50000,
    type: "weapon",
    damage: "1d20",
    attribute: "spirit",
    effect: "Absorve e devolve o dano recebido de um ataque. 1x por combate.",
    icon: "🌀",
    category: "Raros",
  },
  {
    id: "market-vivre-card",
    name: "Pedaço de Vivre Card",
    price: 30000,
    type: "tool",
    effect: "Rastreia uma pessoa específica. Mostra se está viva ou morta.",
    icon: "📄",
    category: "Raros",
  },
  {
    id: "market-bau-tesouro",
    name: "Baú de Tesouro Vazio",
    price: 500,
    type: "tool",
    effect: "Armazena Berries com segurança. Resistente ao fogo e água.",
    icon: "📦",
    category: "Raros",
  },
];
