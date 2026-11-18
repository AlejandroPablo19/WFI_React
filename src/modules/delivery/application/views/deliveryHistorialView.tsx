import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";
import { mostrarAlerta } from "../../shared/utils/mostrarAlerta";
import { clearHistorial } from "../use-cases/clearHistorial";
import { getHistorial } from "../use-cases/getHistorial";

const estadoColor: Record<string, { bg: string; text: string }> = {
  pendiente: { bg: "rgba(217, 140, 30, 0.15)", text: "#a8650a" },
  en_camino: { bg: "rgba(30, 120, 190, 0.15)", text: "#1a6aa5" },
  entregado: { bg: "rgba(15, 119, 95, 0.15)", text: "#0f775f" },
  cancelado: { bg: "rgba(217, 83, 79, 0.15)", text: "#b8332f" },
};

export function DeliveryHistorialView() {
  const router = useRouter();
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmando, setConfirmando] = useState(false);
  const [limpiando, setLimpiando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await getHistorial(deliveryRepository));
    } catch (err) {
      console.error("Error al cargar el historial:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  // Elimina todo el historial con clearHistorial (que usa deleteDelivery).
  const limpiar = async () => {
    if (limpiando) return;

    setLimpiando(true);

    try {
      const total = await clearHistorial(deliveryRepository);

      setItems([]);

      void mostrarAlerta(
        "Historial limpio",
        total === 1
          ? "Se eliminó 1 entrega del historial."
          : `Se eliminaron ${total} entregas del historial.`,
      );
    } catch (err) {
      console.error("Error al limpiar el historial:", err);

      void mostrarAlerta(
        "Error al limpiar",
        "No se pudo limpiar todo el historial. Inténtalo de nuevo.",
      );

      // Recarga para mostrar lo que realmente quedó en el servidor.
      void cargar();
    } finally {
      setConfirmando(false);
      setLimpiando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de entregas</Text>

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
          keyExtractor={(e) => String(e.id)}
          refreshing={loading}
          onRefresh={() => void cargar()}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aún no hay entregas en el historial.
            </Text>
          }
          renderItem={({ item }) => {
            const chip = estadoColor[item.estado] ?? estadoColor.pendiente;
            const etiqueta =
              estadoLabel[item.estado] ?? String(item.estado ?? "Sin estado");

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/delivery/[id]",
                    params: { id: String(item.id) },
                  })
                }
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.filaSuperior}>
                  <Text style={styles.name}>{item.cliente}</Text>
                  <View style={[styles.chip, { backgroundColor: chip.bg }]}>
                    <Text style={[styles.chipTexto, { color: chip.text }]}>
                      {etiqueta}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sub}>{item.direccion}</Text>
                <Text style={styles.total}>
                  Total: ${Number(item.total).toFixed(2)}
                </Text>
              </Pressable>
            );
          }}
        />
      )}

      {!loading && error === null && items.length > 0 && (
        <View style={styles.footer}>
          {confirmando ? (
            <View style={styles.confirmacion}>
              <Text style={styles.confirmacionTexto}>
                ¿Deseas eliminar las {items.length} entregas del historial? Esta
                acción no se puede deshacer.
              </Text>

              <View style={styles.confirmacionBotones}>
                <View style={styles.flex}>
                  <DeliveryButton
                    title="Cancelar"
                    variant="secondary"
                    disabled={limpiando}
                    onPress={() => setConfirmando(false)}
                  />
                </View>

                <View style={styles.flex}>
                  <DeliveryButton
                    title={limpiando ? "Limpiando..." : "Sí, limpiar"}
                    variant="danger"
                    disabled={limpiando}
                    onPress={() => void limpiar()}
                  />
                </View>
              </View>
            </View>
          ) : (
            <DeliveryButton
              title="Limpiar historial"
              variant="danger"
              onPress={() => setConfirmando(true)}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
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
    gap: 6,
  },
  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.title },
  chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  chipTexto: { fontSize: 12, fontWeight: "700" },
  sub: { color: colors.muted },
  total: { color: colors.primary, fontWeight: "bold" },
  empty: { textAlign: "center", color: colors.muted, marginTop: 24 },
  footer: { marginTop: 8 },

  confirmacion: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    gap: 10,
    backgroundColor: colors.dangerSoft,
  },
  confirmacionTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.title,
  },
  confirmacionBotones: {
    flexDirection: "row",
    gap: 8,
  },

  errorContainer: { marginBottom: 12 },
  error: { color: colors.danger, textAlign: "center", marginBottom: 8 },
});
