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
import { firestore } from "@/config/firebase";
import type { Warehouse, WarehouseFormValues } from "../domain/warehouse";

const WAREHOUSES_COLLECTION = "warehouses";

function toWarehouse(id: string, data: Record<string, unknown>): Warehouse {
	const { name, location, capacity, capacityUnit } = data;

	if (
		typeof name !== "string" ||
		typeof location !== "string" ||
		typeof capacity !== "number" ||
		!Number.isFinite(capacity) ||
		capacity < 0 ||
		typeof capacityUnit !== "string"
	) {
		throw new Error(
			`El documento "${id}" de warehouses debe incluir name, location, capacity y capacityUnit válidos.`,
		);
	}

	return { id, name, location, capacity, capacityUnit };
}

export function subscribeToWarehouses(
	onChange: (warehouses: Warehouse[]) => void,
	onError: (error: unknown) => void,
): Unsubscribe {
	return onSnapshot(
		collection(firestore, WAREHOUSES_COLLECTION),
		(snapshot) => {
			try {
				const warehouses = snapshot.docs
					.map((warehouseDocument) =>
						toWarehouse(warehouseDocument.id, warehouseDocument.data()),
					)
					.sort((first, second) => first.name.localeCompare(second.name));
				onChange(warehouses);
			} catch (error) {
				onError(error);
			}
		},
		onError,
	);
}

export async function getWarehouseById(
	id: string,
): Promise<Warehouse | null> {
	const warehouseDocument = await getDoc(
		doc(firestore, WAREHOUSES_COLLECTION, id),
	);
	return warehouseDocument.exists()
		? toWarehouse(warehouseDocument.id, warehouseDocument.data())
		: null;
}

export async function createWarehouse(
	values: WarehouseFormValues,
): Promise<void> {
	await addDoc(collection(firestore, WAREHOUSES_COLLECTION), values);
}

export async function updateWarehouse(
	id: string,
	values: WarehouseFormValues,
): Promise<void> {
	await updateDoc(doc(firestore, WAREHOUSES_COLLECTION, id), values);
}

export async function deleteWarehouse(id: string): Promise<void> {
	await deleteDoc(doc(firestore, WAREHOUSES_COLLECTION, id));
}
