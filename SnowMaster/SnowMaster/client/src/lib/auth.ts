export const OWNER_CODES = {
  "YeahImCelis": { id: "1346484101388959774", username: "BotOwner", role: "owner" as const },
  "YeahImSilly": { id: "1380607427774513152", username: "CoOwner", role: "co-owner" as const }
};

export interface AuthUser {
  id: string;
  username: string;
  role: "owner" | "co-owner";
}

export function setAuthUser(user: AuthUser) {
  localStorage.setItem("auth-user", JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const stored = localStorage.getItem("auth-user");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  localStorage.removeItem("auth-user");
}

export function isValidOwnerCode(code: string): boolean {
  return code in OWNER_CODES;
}

export function getUserFromCode(code: string): AuthUser | null {
  const userInfo = OWNER_CODES[code as keyof typeof OWNER_CODES];
  return userInfo || null;
}
