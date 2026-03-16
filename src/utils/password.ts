export interface PasswordRule {
  label: string;
  test: (pwd: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "10 caractères minimum", test: (p) => p.length >= 10 },
  { label: "Une majuscule", test: (p) => /[A-Z]/.test(p) },
  { label: "Une minuscule", test: (p) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p) => /[0-9]/.test(p) },
  { label: "Un caractère spécial (!@#$%^&*...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors = PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.label);
  return { valid: errors.length === 0, errors };
}
