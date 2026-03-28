export function reportError(scope: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.error(scope, error);
    return;
  }

  // Production: log minimal info (no sensitive data)
  console.error(scope, error instanceof Error ? error.message : 'Unknown error');
}