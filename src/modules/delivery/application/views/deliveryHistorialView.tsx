import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { getDeliveries } from "../use-cases/getDelivery";

export function DeliveryHistorialView() {
  const router = useRouter();
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getDeliveries(deliveryRepository));
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Fruits</Text>

      {loading && <ActivityIndicator size="large" />}

      {error && (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Button title="Reintentar" onPress={cargar} />
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={items}
          keyExtractor={(e) => e.id}
          refreshing={loading}
          onRefresh={cargar}
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
            </View>
          )}
        />
      )}

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
  empty: { textAlign: "center", color: "#666", marginTop: 24 },
  error: { color: "#c0392b", textAlign: "center", marginBottom: 8 },
});
