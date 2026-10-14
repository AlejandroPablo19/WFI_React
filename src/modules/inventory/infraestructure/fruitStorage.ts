import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Fruit } from "../presentation/components/fruit";

const FRUITS_STORAGE_KEY = "@wfi/inventory/fruits";

function isFruit(value: unknown): value is Fruit {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const fruit = value as Record<string, unknown>;
	return (
		typeof fruit.id === "string" &&
		typeof fruit.name === "string" &&
		typeof fruit.quantity === "string" &&
		typeof fruit.unit === "string"
	);
}

export async function loadFruits(): Promise<Fruit[]> {
	const storedFruits = await AsyncStorage.getItem(FRUITS_STORAGE_KEY);
	if (storedFruits === null) {
		return [];
	}

	const parsed: unknown = JSON.parse(storedFruits);
	if (!Array.isArray(parsed) || !parsed.every(isFruit)) {
		throw new Error("El inventario guardado tiene un formato inválido.");
	}

	return parsed;
}

export async function saveFruits(fruits: Fruit[]): Promise<void> {
	await AsyncStorage.setItem(FRUITS_STORAGE_KEY, JSON.stringify(fruits));
}
