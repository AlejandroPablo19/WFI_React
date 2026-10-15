import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryMockRepository";
import { getHistorial } from "../use-cases/getHistorial";

export function DeliveryHistorialView() {
  const [items, setItems] = useState<Delivery[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHistorial(deliveryRepository).then(setItems);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕘 Historial de entregas</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no hay entregas finalizadas.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.cliente}</Text>
            <Text style={item.estado === "cancelado" ? styles.bad : styles.sub}>
              {estadoLabel[item.estado]} · ${item.total}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#ddd" },
  name: { fontSize: 16, fontWeight: "600" },
  sub: { color: "#666", marginTop: 2 },
  bad: { color: "#c0392b", marginTop: 2 },
  empty: { textAlign: "center", color: "#666", marginTop: 24 },
});
