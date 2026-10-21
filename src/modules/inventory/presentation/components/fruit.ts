export interface Fruit {
	id: string;
	name: string;
	quantity: string;
	unit: string;
}

export type FruitFormValues = Omit<Fruit, "id">;
