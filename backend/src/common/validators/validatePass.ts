export const validatePassword = (password: string): string | null => {
  const errors: string[] = [];

  // Minimum characters
  if (password.length < 12) {
    errors.push("debe tener al menos 12 caracteres.");
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push("debe contener al menos un número.");
  }

  // At least one letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("debe contener al menos una letra.");
  }

  // At least one capital letter
  if (!/[A-Z]/.test(password)) {
    errors.push("debe contener al menos una letra mayúscula.");
  }

  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("debe contener al menos un carácter especial.");
  }

  // Avoid common passwords
  const commonPasswords = [
    "123456", "12345678Abc", "password", "123456789",
    "qwerty", "abc123", "contrañesa123", "contraseña", "contrasena"
  ];
  
  if (commonPasswords.includes(password)) {
    errors.push("es demasiado común.");
  }

  return errors.length > 0 
    ? `La contraseña no cumple lo siguiente:\n- ${errors.join("\n- ")}` 
    : null;
};
