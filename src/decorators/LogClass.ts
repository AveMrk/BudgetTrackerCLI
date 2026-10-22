
import { readonlyProperties } from "./ReadOnly";

export function LogClass<T extends new (...args: any[]) => object>(
  target: T,
): T {
  const WrappedClass = class extends target {
    constructor(...args: any[]) {
      super(...args);

      // Запрещаем менять свойства, отмеченные @ReadOnly.
      const properties = readonlyProperties.get(target.prototype) ?? [];

      for (const property of properties) {
        const value = (this as any)[property];

        Object.defineProperty(this, property, {
          value,
          writable: false,
          configurable: false,
          enumerable: true,
        });
      }

      console.log(
        `Создан экземпляр класса ${target.name} с аргументами: ${JSON.stringify(args)}`,
      );
    }
  };

  Object.defineProperty(WrappedClass, "name", {
    value: target.name,
  });

  return WrappedClass as T;
}
