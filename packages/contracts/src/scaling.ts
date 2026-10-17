const DECIMAL_PATTERN = /^([+-])?(\d+)(?:\.(\d+))?$/;

function getScale(decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error(`decimals must be a non-negative integer`);
  }
  return 10n ** BigInt(decimals);
}

export function toProtocolAmount(humanAmount: string, decimals: number): bigint {
  const scale = getScale(decimals);
  const input = humanAmount.trim();
  const match = DECIMAL_PATTERN.exec(input);

  if (!match) {
    throw new Error(`Invalid decimal amount: ${input}`);
  }

  const [, sign = "", wholePart, fractionalPart = ""] = match;

  if (fractionalPart.length > decimals) {
    throw new Error(`Amount has more than ${decimals} decimal places`);
  }

  const whole = BigInt(wholePart) * scale;
  const fraction = BigInt(fractionalPart.padEnd(decimals, "0") || "0");
  const raw = whole + fraction;

  return sign === "-" ? -raw : raw;
}

export function fromProtocolAmount(protocolAmount: bigint, decimals: number): string {
  const scale = getScale(decimals);
  const isNegative = protocolAmount < 0n;
  const absolute = isNegative ? -protocolAmount : protocolAmount;

  const whole = absolute / scale;
  const fraction = absolute % scale;
  const prefix = isNegative && absolute !== 0n ? "-" : "";

  if (decimals === 0) {
    return `${prefix}${whole.toString()}`;
  }

  const fractionalDigits = fraction.toString().padStart(decimals, "0");
  const trimmedFraction = fractionalDigits.replace(/0+$/, "");

  return trimmedFraction
    ? `${prefix}${whole.toString()}.${trimmedFraction}`
    : `${prefix}${whole.toString()}`;
}
