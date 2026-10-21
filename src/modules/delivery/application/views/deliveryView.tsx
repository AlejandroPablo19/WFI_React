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
import { deleteDelivery } from "../use-cases/deleteDelivery";
import { getDeliveries } from "../use-cases/getDelivery";

export function DeliveryView() {
  const router = useRouter();

  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [idPorEliminar, setIdPorEliminar] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const deliveries = await getDeliveries(deliveryRepository);
      setItems(deliveries);
    } catch (err) {
      console.error("Error al cargar entregas:", err);
      setError("No se pudieron cargar las entregas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  // Mostrar el recuadro de confirmación.
  const eliminar = (id: string) => {
    console.log("Eliminar presionado:", id);
    setIdPorEliminar(id);
  };

  // Eliminar la entrega desde el backend.
  const confirmarEliminacion = async () => {
    if (idPorEliminar === null || deletingId !== null) {
      return;
    }

    const id = idPorEliminar;
    setDeletingId(id);
    setError(null);

    try {
      await deleteDelivery(deliveryRepository, id);

      setItems((actuales) =>
        actuales.filter((entrega) => String(entrega.id) !== String(id)),
      );

      setIdPorEliminar(null);
    } catch (err) {
      console.error("Error al eliminar la entrega:", err);
      setError(
        "No se pudo eliminar la entrega. Comprueba el backend y el repositorio.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Fruits</Text>

      {idPorEliminar !== null && (
        <View style={styles.confirmacion}>
          <Text style={styles.confirmacionTexto}>
            ¿Deseas eliminar la entrega {idPorEliminar}?
          </Text>

          <Button
            title={
              deletingId === idPorEliminar ? "Eliminando..." : "Sí, eliminar"
            }
            color="#c0392b"
            disabled={deletingId !== null}
            onPress={() => void confirmarEliminacion()}
          />

          <Button
            title="Cancelar"
            disabled={deletingId !== null}
            onPress={() => setIdPorEliminar(null)}
          />
        </View>
      )}

      {loading && <ActivityIndicator size="large" />}

      {error !== null && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Reintentar" onPress={() => void cargar()} />
        </View>
      )}

      {!loading && error === null && (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          refreshing={loading}
          onRefresh={() => void cargar()}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay entregas activas.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/delivery/[id]",
                    params: { id: String(item.id) },
                  })
                }
              >
                <Text style={styles.name}>{item.cliente}</Text>

                <Text style={styles.sub}>
                  {estadoLabel[item.estado]} · {item.direccion}
                </Text>

                <Text style={styles.total}>Total: ${item.total}</Text>
              </Pressable>

              <View style={styles.buttonContainer}>
                <Button
                  title="Ver detalles"
                  onPress={() =>
                    router.push({
                      pathname: "/delivery/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                />

                <Button
                  title="Eliminar"
                  color="#c0392b"
                  disabled={deletingId !== null}
                  onPress={() => eliminar(String(item.id))}
                />
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Historial"
          onPress={() => router.push("/delivery/historial")}
        />

        <Button
          title="Nueva entrega"
          onPress={() => router.push("/delivery/add")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#d82222",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderColor: "#1947a4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    color: "#666666",
    marginTop: 4,
  },
  total: {
    color: "#1947a4",
    fontWeight: "bold",
    marginTop: 6,
  },
  buttonContainer: {
    gap: 8,
  },
  footer: {
    gap: 8,
    marginTop: 8,
  },
  confirmacion: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#c0392b",
    borderRadius: 8,
    gap: 8,
    backgroundColor: "#fff5f5",
  },
  confirmacionTexto: {
    fontSize: 16,
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    color: "#666666",
    marginTop: 24,
  },
  errorContainer: {
    marginBottom: 12,
  },
  error: {
    color: "#c0392b",
    marginBottom: 8,
  },
});
