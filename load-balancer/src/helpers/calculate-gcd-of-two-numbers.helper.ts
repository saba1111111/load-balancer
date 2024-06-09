// gcd = Greatest Common Divisor
export function calculateGcdOfTwoNumbers(a: number, b: number) {
  if (b === 0) {
    return a;
  }

  return calculateGcdOfTwoNumbers(b, a % b);
}
