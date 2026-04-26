/**
 * Manual implementation of cn function to avoid external dependencies
 * if they are failing to install.
 */
export function cn(...inputs: unknown[]) {
  return inputs.flat().filter(Boolean).join(" ");
}
