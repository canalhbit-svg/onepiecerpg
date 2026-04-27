import type { AuthUser } from "@workspace/replit-auth-web";

export const MASTER_EMAIL = "canalhbit@gmail.com";

export type UserRole = "mestre" | "jogador";

export function isMasterEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === MASTER_EMAIL.toLowerCase();
}

export function getRole(user: AuthUser | null): UserRole {
  return isMasterEmail(user?.email) ? "mestre" : "jogador";
}

export function isMasterUser(user: AuthUser | null): boolean {
  return isMasterEmail(user?.email);
}
