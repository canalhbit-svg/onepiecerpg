export const MASTER_EMAIL = "canalhbit@gmail.com";

export type UserRole = "mestre" | "jogador";

export function isMaster(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === MASTER_EMAIL.toLowerCase();
}

export function getRole(email: string | null | undefined): UserRole {
  return isMaster(email) ? "mestre" : "jogador";
}
