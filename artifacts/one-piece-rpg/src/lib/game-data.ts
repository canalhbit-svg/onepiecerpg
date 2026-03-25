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
  "Cozinheiro",
  "Navegador",
  "Médico",
  "Músico",
  "Atirador",
  "Arqueólogo",
  "Carpinteiro",
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

export const SPECIALTY_BONUSES: Record<string, { attr: AttributeKey, dice: DiceType }> = {
  "Combatente": { attr: "vigor", dice: "d4" },
  "Cozinheiro": { attr: "cunning", dice: "d4" },
  "Navegador": { attr: "agility", dice: "d4" },
  "Médico": { attr: "cunning", dice: "d4" },
  "Músico": { attr: "charisma", dice: "d4" },
  "Atirador": { attr: "agility", dice: "d4" },
  "Arqueólogo": { attr: "cunning", dice: "d4" },
  "Carpinteiro": { attr: "vigor", dice: "d4" },
  "Ladrão": { attr: "agility", dice: "d4" },
};
