import { Stack } from "expo-router";

export default function FruitsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Frutas" }} />
      <Stack.Screen name="add" options={{ title: "Agregar fruta" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle de fruta" }} />
    </Stack>
    
  );
}