import { UserRequest } from './dtoRequest';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ANONYMOUS_KEY = 'session_id';

/* ---------- helpers privados ---------- */
const isNumeric = (n: unknown) => !isNaN(Number(n));

/**
 * Decodifica base64-url.
 * Devuelve null si falla.
 */
const b64UrlDecode = (str: string): string | null => {
  try {
    return decodeURIComponent(
      atob(str.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    return null;
  }
};

/**
 * Validación rápida de un JWT:
 *  - forma (3 partes)
 *  - JSON válido
 *  - tiene exp y no expirado
 *  - tiene sub o email
 * Devuelve el token limpio o null.
 */
const validateJWT = (token: string): string | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payloadStr = b64UrlDecode(parts[1]);
  if (!payloadStr) return null;

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(payloadStr);
  } catch {
    return null;
  }

  const exp = payload.exp;
  if (!exp || !isNumeric(exp) || Number(exp) * 1000 < Date.now()) return null;

  if (!payload.sub && !payload.email) return null;
  return token;
};

/* ---------- API pública ---------- */
export const tokenManager = {
  getToken(): string | null {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    const trimmed = raw.trim();
    const valid = validateJWT(trimmed);
    return valid;
  },

  getUser(): UserRequest | null {
    try {
      const str = localStorage.getItem(USER_KEY);
      if (!str) return null;
      const parsed = JSON.parse(str) as unknown;
      if (
        parsed &&
        typeof parsed === 'object' &&
        'id' in parsed &&
        'email' in parsed
      ) {
        return parsed as UserRequest;
      }
    } catch {
      /* corrupto */
    }
    return null;
  },

  getAnonimous(): string {
    let id = localStorage.getItem(ANONYMOUS_KEY);
    if (!id) {
      id = self.crypto.randomUUID();
      localStorage.setItem(ANONYMOUS_KEY, id);
    }
    return id;
  },

  setTokens(token: string): void {
    const clean = validateJWT(token);
    if (!clean) throw new Error('Token inválido o expirado');
    localStorage.setItem(TOKEN_KEY, clean);
  },

  setUser(user: UserRequest): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ANONYMOUS_KEY);
  },
} as const;