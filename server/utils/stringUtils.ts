export function protect(input: string): string {
  let cleanedInput = input;
  cleanedInput = cleanedInput.replace(/</g, "");
  cleanedInput = cleanedInput.replace(/>/g, "");
  cleanedInput = cleanedInput.replace(/\*/g, ""); // Escape the asterisk
  cleanedInput = cleanedInput.replace(/script/gi, ""); // Use global and case-insensitive flag
  cleanedInput = cleanedInput.replace(/ and /gi, ""); // Use global and case-insensitive flag
  cleanedInput = cleanedInput.replace(/ or /gi, ""); // Use global and case-insensitive flag
  cleanedInput = cleanedInput.replace(/'/g, ""); // Escape the single quote
  cleanedInput = cleanedInput.replace(/\"/g, ""); // Escape the double quote
  return cleanedInput;
}
