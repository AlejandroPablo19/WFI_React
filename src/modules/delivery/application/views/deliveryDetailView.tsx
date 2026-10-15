import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryMockRepository";
import { deleteDelivery } from "../use-cases/deleteDelivery";
import { getDeliveryById } from "../use-cases/getDeliveryById";

export function DeliveryDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Delivery>();

  useFocusEffect(
    useCallback(() => {
      getDeliveryById(deliveryRepository, id).then(setD);
    }, [id]),
  );

  const confirmarEliminar = () =>
    Alert.alert("Eliminar entrega", "¿Seguro que quieres eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteDelivery(deliveryRepository, id);
          router.back();
        },
      },
    ]);

  if (!d) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la entrega.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{d.cliente}</Text>
      <Text>Dirección: {d.direccion}</Text>
      <Text>Repartidor: {d.repartidor}</Text>
      <Text>Estado: {estadoLabel[d.estado]}</Text>
      <Text style={styles.total}>Total: ${d.total}</Text>

      <Button
        title="Ver seguimiento"
        onPress={() => {
          console.log("Abriendo seguimiento, ID:", id);

          router.push({
            pathname: "/delivery/seguimiento",
            params: { id: String(id) },
          });
        }}
      />
      <Button
        title="Editar"
        onPress={() =>
          router.push({ pathname: "/delivery/edit/[id]", params: { id } })
        }
      />
      <Button title="Eliminar" color="red" onPress={confirmarEliminar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: "bold" },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
});
