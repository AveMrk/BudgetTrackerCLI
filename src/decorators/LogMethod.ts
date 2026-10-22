
export function LogMethod(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  if (typeof originalMethod !== "function") {
    throw new Error(`@LogMethod можно применить только к методу: ${propertyKey}`);
  }

  descriptor.value = function (...args: unknown[]) {
    console.log(
      `Вызов метода ${propertyKey} с аргументами: ${JSON.stringify(args)}`,
    );

    const result: unknown = originalMethod.apply(this, args);

    if (
      result !== null &&
      typeof result === "object" &&
      "then" in result &&
      typeof result.then === "function"
    ) {
      return Promise.resolve(result).then(
        (value: unknown) => {
          console.log(
            `Метод ${propertyKey} вернул: ${JSON.stringify(value)}`,
          );
          return value;
        },
        (error: unknown) => {
          throw error;
        },
      );
    }

    console.log(
      `Метод ${propertyKey} вернул: ${JSON.stringify(result)}`,
    );

    return result;
  };

  return descriptor;
}
