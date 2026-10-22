
export const readonlyProperties = new WeakMap<
  object,
  (string | symbol)[]
>();

export function ReadOnly(
  target: object,
  propertyKey: string | symbol,
): void {
  const properties = readonlyProperties.get(target) ?? [];

  if (!properties.includes(propertyKey)) {
    properties.push(propertyKey);
  }

  readonlyProperties.set(target, properties);
}
