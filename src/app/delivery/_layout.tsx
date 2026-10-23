// app/delivery/_layout.tsx
import { Stack } from "expo-router";

export default function DeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Envio" }} />
      <Stack.Screen name="add" options={{ title: "Nueva entrega" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle de entrega" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Editar entrega" }} />
      <Stack.Screen
        name="direccion"
        options={{ title: "Dirección de entrega" }}
      />
      <Stack.Screen name="resumen" options={{ title: "Resumen de entrega" }} />
      <Stack.Screen
        name="seguimiento"
        options={{ title: "Seguimiento del pedido" }}
      />
      <Stack.Screen
        name="historial"
        options={{ title: "Historial de entregas" }}
      />
    </Stack>
  );
}
