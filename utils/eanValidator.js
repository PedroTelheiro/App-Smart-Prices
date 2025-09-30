/**
 * Valida um código de barras EAN-13 usando o algoritmo de checksum.
 * @param {string} code O código de barras a ser validado.
 * @returns {boolean} Retorna true se o código for válido, false caso contrário.
 */
export function isValidEAN(code) {
  
  if (typeof code !== 'string' || code.length !== 13) {
    return false;
  }
  
  // Verifica se todos os caracteres são dígitos numéricos
  if (!/^\d+$/.test(code)) {
    return false;
  }

  // Implementa o algoritmo de checksum do EAN-13
  const digits = code.split('').map(Number);
  const checksumDigit = digits.pop();

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += i % 2 === 1 ? digits[i] * 3 : digits[i];
  }
  
  const calculatedChecksum = (10 - (sum % 10)) % 10;

  return calculatedChecksum === checksumDigit;
}