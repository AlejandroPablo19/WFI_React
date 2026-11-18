import { Stack } from "expo-router";

export default function WarehouseLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "Almacenes" }} />
			<Stack.Screen name="add" options={{ title: "Agregar almacén" }} />
			<Stack.Screen name="[id]" options={{ title: "Editar almacén" }} />
		</Stack>
	);
}
