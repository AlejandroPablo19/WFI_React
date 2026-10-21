import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Delivery, DeliveryStatus } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { getDeliveryById } from "../use-cases/getDeliveryById";

const pasos = [
  "Pedido recibido",
  "Preparando pedido",
  "En camino",
  "Entregado",
];

// Cuántos pasos están cumplidos según el estado
const pasosCumplidos: Record<DeliveryStatus, number> = {
  pendiente: 2,
  en_camino: 3,
  entregado: 4,
  cancelado: 0,
};

export const DeliverySeguimientoView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [d, setD] = useState<Delivery>();

  useEffect(() => {
    if (id) getDeliveryById(deliveryRepository, id).then(setD);
  }, [id]);

  const cumplidos = d ? pasosCumplidos[d.estado] : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 Seguimiento del pedido</Text>
      {d ? (
        <Text>Repartidor: {d.repartidor}</Text>
      ) : (
        <Text>Selecciona una entrega desde su detalle.</Text>
      )}
      {d?.estado === "cancelado" && (
        <Text style={styles.cancel}>Esta entrega fue cancelada.</Text>
      )}
      {pasos.map((p, i) => (
        <Text
          key={p}
          style={[styles.paso, i < cumplidos ? styles.done : styles.pending]}
        >
          {i < cumplidos ? "✅" : "⬜"} {p}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  paso: { fontSize: 16, paddingVertical: 6 },
  done: { color: "#000" },
  pending: { color: "#888" },
  cancel: { color: "#c0392b", fontWeight: "600" },
});
