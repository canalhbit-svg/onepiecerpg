import { useState, useEffect, useRef } from "react";
import { useGetCharacter, useSaveCharacter, type CharacterInput, type InventoryItem } from "@workspace/api-client-react";
import { useDebounceCallback } from "usehooks-ts";
import { IdentitySection } from "@/components/character/IdentitySection";
import { XPSection } from "@/components/character/XPSection";
import { AttributesSection } from "@/components/character/AttributesSection";
import { CombatSection } from "@/components/character/CombatSection";
import { LogbookSection } from "@/components/character/LogbookSection";
import { XPLogSection } from "@/components/character/XPLogSection";
import { InventorySection } from "@/components/character/InventorySection";
import { DICE_COSTS, SPECIALTY_STARTER_KITS, type AttributeKey } from "@/lib/game-data";
import { generateId } from "@/lib/utils";
import { Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultChar: CharacterInput = {
  playerName: "",
  pirateName: "",
  origin: "",
  specialty: "",
  vigor: { value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } },
  agility: { value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } },
  cunning: { value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } },
  charisma: { value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } },
  spirit: { value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } },
  maxHp: 10,
  currentHp: 10,
  berries: 0,
  xpTotal: 0,
  logbook: "",
  xpLog: [],
  inventory: [],
  currentStamina: 0,
  haki: null,
  devilFruit: null,
};

export default function CharacterSheet() {
  const { data: serverChar, isLoading } = useGetCharacter({ query: { retry: false } });
  const saveMutation = useSaveCharacter();

  const [localChar, setLocalChar] = useState<CharacterInput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const prevSpecialty = useRef<string>("");

  useEffect(() => {
    if (!localChar && !isLoading) {
      const base = serverChar || defaultChar;
      setLocalChar({ ...defaultChar, ...base, inventory: base.inventory ?? [] });
      prevSpecialty.current = (serverChar?.specialty ?? "");
    }
  }, [serverChar, isLoading, localChar]);

  const debouncedSave = useDebounceCallback((charToSave: CharacterInput) => {
    setIsSaving(true);
    saveMutation.mutate(
      { data: charToSave },
      { onSettled: () => setTimeout(() => setIsSaving(false), 1000) }
    );
  }, 1500);

  const handleChange = (updates: Partial<CharacterInput>) => {
    if (!localChar) return;
    let updated = { ...localChar, ...updates };

    // Auto-assign starter kit when specialty changes
    if (updates.specialty && updates.specialty !== prevSpecialty.current) {
      const kit = SPECIALTY_STARTER_KITS[updates.specialty];
      if (kit) {
        const currentInventory: InventoryItem[] = Array.isArray(updated.inventory) ? updated.inventory : [];
        // Remove old starter kit (any item whose id starts with "starter-")
        const withoutOldKit = currentInventory.filter(i => !i.id.startsWith("starter-"));
        const newKit: InventoryItem = { ...kit, id: `starter-${generateId()}` };
        updated = { ...updated, inventory: [newKit, ...withoutOldKit] };
      }
      prevSpecialty.current = updates.specialty;
    }

    setLocalChar(updated);
    debouncedSave(updated);
  };

  if (isLoading || !localChar) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate available XP
  let xpSpent = 0;
  const attributes: AttributeKey[] = ['vigor', 'agility', 'cunning', 'charisma', 'spirit'];
  attributes.forEach(attr => {
    const pool = localChar[attr]?.dicePool;
    if (pool) {
      xpSpent += (pool.d4 * DICE_COSTS.d4) + (pool.d6 * DICE_COSTS.d6) + (pool.d10 * DICE_COSTS.d10) + (pool.d20 * DICE_COSTS.d20);
    }
  });
  const xpAvailable = (4 + localChar.xpTotal) - xpSpent;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 relative">

      {/* Auto-save indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur border border-primary/50 text-primary px-4 py-2 rounded-full flex items-center shadow-lg shadow-primary/20"
          >
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm font-bold tracking-wider">Salvando...</span>
          </motion.div>
        )}
        {!isSaving && saveMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50 bg-green-950/80 backdrop-blur border border-green-500/50 text-green-400 px-4 py-2 rounded-full flex items-center shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold tracking-wider">Salvo</span>
          </motion.div>
        )}
      </AnimatePresence>

      <IdentitySection character={localChar} onChange={handleChange} />
      <XPSection character={localChar} onChange={handleChange} />
      <AttributesSection character={localChar} onChange={handleChange} xpAvailable={xpAvailable} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CombatSection character={localChar} onChange={handleChange} />
        </div>
        <div className="lg:col-span-1">
          <XPLogSection log={localChar.xpLog} />
        </div>
      </div>

      <InventorySection character={localChar} onChange={handleChange} />

      <LogbookSection character={localChar} onChange={handleChange} />
    </div>
  );
}
