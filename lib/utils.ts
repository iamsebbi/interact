/**
 * Manual implementation of cn function to avoid external dependencies
 * if they are failing to install.
 */
export function cn(...inputs: any[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ");
}
