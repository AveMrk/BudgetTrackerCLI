
export interface Identifiable {
  id: number;
}

export interface Describable {
  describe(): string;
}

export class GenericStorage<T extends Identifiable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  removeById(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  describeAll(): void {
    for (const item of this.items) {
      if (
        "describe" in item &&
        typeof item.describe === "function"
      ) {
        console.log(item.describe());
      } else {
        console.log(`Элемент id: ${item.id} не содержит описания.`);
      }
    }
  }
}

export class Product implements Identifiable, Describable {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}

  describe(): string {
    return `Product #${this.id}: ${this.name}, price: $${this.price}`;
  }
}

// Проверка решения
const productStorage = new GenericStorage<Product>();

productStorage.add(new Product(1, "Ноутбук", 150000));
productStorage.add(new Product(2, "Смартфон", 80000));
productStorage.add(new Product(3, "Планшет", 50000));

// Добавляем объект без метода describe()
productStorage.add({ id: 4 } as Product);

console.log("--- Описание всех продуктов ---");
productStorage.describeAll();

console.log("--- Поиск продукта ---");
console.log(productStorage.getById(2));

console.log("--- Удаление продукта ---");
console.log(productStorage.removeById(3));
console.log(productStorage.removeById(99));

console.log("--- Все продукты после удаления ---");
console.log(productStorage.getAll());
