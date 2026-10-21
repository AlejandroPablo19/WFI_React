export interface Warehouse {
	id: string;
	name: string;
	location: string;
	capacity: number;
	capacityUnit: string;
}

export type WarehouseFormValues = Omit<Warehouse, "id">;
