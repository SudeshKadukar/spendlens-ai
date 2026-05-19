import type { FormAuditInput } from "./types";

export const FORM_STORAGE_KEY = "spendLensData";

export function loadFormState(): FormAuditInput | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(FORM_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FormAuditInput;
  } catch {
    return null;
  }
}

export function saveFormState(state: FormAuditInput): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(state));
}

export function clearFormState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FORM_STORAGE_KEY);
}
