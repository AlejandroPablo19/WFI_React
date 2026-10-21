import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
	type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Fruit, FruitFormValues } from "../presentation/components/fruit";

const FRUITS_COLLECTION = "fruits";

function toFruit(id: string, data: Record<string, unknown>): Fruit {
	const { name, quantity, unit } = data;
	if (
		typeof name !== "string" ||
		(typeof quantity !== "string" &&
			(typeof quantity !== "number" || !Number.isFinite(quantity))) ||
		typeof unit !== "string"
	) {
		throw new Error(
			`El documento "${id}" de fruits debe incluir name, quantity y unit válidos.`,
		);
	}

	return {
		id,
		name,
		quantity: String(quantity),
		unit,
	};
}

export function subscribeToFruits(
	onChange: (fruits: Fruit[]) => void,
	onError: (error: unknown) => void,
): Unsubscribe {
	return onSnapshot(
		collection(db, FRUITS_COLLECTION),
		(snapshot) => {
			try {
				onChange(
					snapshot.docs.map((fruitDocument) =>
						toFruit(fruitDocument.id, fruitDocument.data()),
					),
				);
			} catch (error) {
				onError(error);
			}
		},
		onError,
	);
}

export async function getFruitById(id: string): Promise<Fruit | null> {
	const fruitDocument = await getDoc(doc(db, FRUITS_COLLECTION, id));
	return fruitDocument.exists()
		? toFruit(fruitDocument.id, fruitDocument.data())
		: null;
}

export async function createFruit(values: FruitFormValues): Promise<void> {
	await addDoc(collection(db, FRUITS_COLLECTION), values);
}

export async function updateFruit(
	id: string,
	values: FruitFormValues,
): Promise<void> {
	await updateDoc(doc(db, FRUITS_COLLECTION, id), values);
}

export async function deleteFruit(id: string): Promise<void> {
	await deleteDoc(doc(db, FRUITS_COLLECTION, id));
}
