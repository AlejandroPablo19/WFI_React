import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Delivery, estadoLabel } from "../../domain/entities/delivery";

import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";
import { mostrarAlerta } from "../../shared/utils/mostrarAlerta";
import { deleteDelivery } from "../use-cases/deleteDelivery";
import { getDeliveries } from "../use-cases/getDelivery";

export function DeliveryView() {
  const router = useRouter();

  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // solo errores de carga
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
    setIdPorEliminar(id);
  };

  // Eliminar la entrega desde el backend.
  const confirmarEliminacion = async () => {
    if (idPorEliminar === null || deletingId !== null) {
      return;
    }

    const id = idPorEliminar;
    setDeletingId(id);

    try {
      await deleteDelivery(deliveryRepository, id);

      setItems((actuales) =>
        actuales.filter((entrega) => String(entrega.id) !== String(id)),
      );

      setIdPorEliminar(null);
      setDeletingId(null);

      // Sin await: no bloquea la UI mientras la alerta está abierta.
      void mostrarAlerta(
        "Entrega eliminada",
        "La entrega se eliminó correctamente.",
      );
    } catch (err) {
      console.error("Error al eliminar la entrega:", err);

      setIdPorEliminar(null);
      setDeletingId(null);

      void mostrarAlerta(
        "Error al eliminar",
        "No se pudo eliminar la entrega. Inténtalo de nuevo.",
      );
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

          <DeliveryButton
            title={
              deletingId === idPorEliminar ? "Eliminando..." : "Sí, eliminar"
            }
            variant="danger"
            disabled={deletingId !== null}
            onPress={() => void confirmarEliminacion()}
          />

          <DeliveryButton
            title="Cancelar"
            variant="secondary"
            disabled={deletingId !== null}
            onPress={() => setIdPorEliminar(null)}
          />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      {error !== null && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <DeliveryButton title="Reintentar" onPress={() => void cargar()} />
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
              <View>
                <Text style={styles.name}>{item.cliente}</Text>

                <Text style={styles.sub}>
                  {estadoLabel[item.estado]} · {item.direccion}
                </Text>

                <Text style={styles.total}>Total: ${item.total}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <DeliveryButton
                  title="Ver detalles"
                  onPress={() =>
                    router.push({
                      pathname: "/delivery/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                />

                <DeliveryButton
                  title="Eliminar"
                  variant="danger"
                  disabled={deletingId !== null}
                  onPress={() => eliminar(String(item.id))}
                />
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <DeliveryButton
          title="Historial"
          variant="secondary"
          onPress={() => router.push("/delivery/historial")}
        />

        <DeliveryButton
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
    backgroundColor: colors.background,
  },
  title: {
    color: colors.title,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.title,
  },
  sub: {
    color: colors.muted,
    marginTop: 4,
  },
  total: {
    color: colors.primary,
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
    borderColor: colors.danger,
    borderRadius: 16,
    gap: 8,
    backgroundColor: colors.dangerSoft,
  },
  confirmacionTexto: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.title,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 24,
  },
  errorContainer: {
    marginBottom: 12,
  },
  error: {
    color: colors.danger,
    marginBottom: 8,
  },
});
