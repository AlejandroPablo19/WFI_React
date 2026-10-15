import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryMockRepository";
import { deleteDelivery } from "../use-cases/deleteDelivery";
import { getDeliveries } from "../use-cases/getDelivery";

export function DeliveryView() {
  const router = useRouter();
  const [items, setItems] = useState<Delivery[]>([]);

  const cargar = useCallback(() => {
    getDeliveries(deliveryRepository).then(setItems);
  }, []);

  // Se recarga cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(cargar);

  const confirmarEliminar = (id: string) =>
    Alert.alert("Eliminar entrega", "¿Seguro que quieres eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteDelivery(deliveryRepository, id);
          cargar();
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Fruits</Text>
      <FlatList
        data={items}
        keyExtractor={(e) => e.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay entregas activas.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/delivery/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.name}>{item.cliente}</Text>
              <Text style={styles.sub}>
                {estadoLabel[item.estado]} · {item.direccion}
              </Text>
            </Pressable>
            {/* <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/delivery/edit/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.edit}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => confirmarEliminar(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View> */}
          </View>
        )}
      />
      <Button
        title="Historial"
        onPress={() => router.push("/delivery/historial")}
      />
      <View style={{ height: 8 }} />
      <Button
        title="Nueva entrega"
        onPress={() => router.push("/delivery/add")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#d82222",
    marginBottom: 10,
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
  },
  container: { flex: 1, padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#1947a4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  sub: { color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", gap: 16, marginTop: 8 },
  edit: { color: "#0a7ea4", fontWeight: "600" },
  del: { color: "#c0392b", fontWeight: "600" },
  empty: { textAlign: "center", color: "#666", marginTop: 24 },
});
