import { Stack } from "expo-router";

export default function WarehouseLayout() {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "#F3F8F7" },
				headerStyle: { backgroundColor: "#F3F8F7" },
				headerTintColor: "#173F4A",
				headerTitleStyle: { fontWeight: "700" },
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="add" options={{ title: "Agregar almacén" }} />
			<Stack.Screen name="[id]" options={{ title: "Editar almacén" }} />
		</Stack>
	);
}
