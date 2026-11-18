import { Stack } from "expo-router";

export default function InventoryLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "Inventario" }} />
			<Stack.Screen name="add" options={{ title: "Agregar fruta" }} />
			<Stack.Screen name="[id]" options={{ title: "Editar fruta" }} />
		</Stack>
	);
}
