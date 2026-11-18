import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Delivery, estadoLabel } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { getDeliveryById } from "../use-cases/getDeliveryById";

const C = {
  bg: "#f3f7f6",
  card: "#ffffff",
  title: "#17383e",
  label: "#518475",
  muted: "#6b7b78",
  primary: "#0f775f",
  primarySoft: "#e6f2ef",
  border: "#e6ecea",
};

// Colores del chip de estado (fondo translúcido + texto fuerte)
const estadoColor: Record<string, { bg: string; text: string }> = {
  pendiente: { bg: "rgba(217, 140, 30, 0.15)", text: "#a8650a" },
  en_camino: { bg: "rgba(30, 120, 190, 0.15)", text: "#1a6aa5" },
  entregado: { bg: "rgba(15, 119, 95, 0.15)", text: "#0f775f" },
  cancelado: { bg: "rgba(217, 83, 79, 0.15)", text: "#b8332f" },
};

type FilaProps = { icono: string; etiqueta: string; valor: string };

function Fila({ icono, etiqueta, valor }: FilaProps) {
  return (
    <View style={styles.fila}>
      <View style={styles.icono}>
        <Text style={styles.iconoTexto}>{icono}</Text>
      </View>
      <View style={styles.filaTexto}>
        <Text style={styles.label}>{etiqueta}</Text>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

export function DeliveryDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Delivery>();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getDeliveryById(deliveryRepository, id)
        .then(setD)
        .catch(() => setD(undefined))
        .finally(() => setLoading(false));
    }, [id]),
  );

  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (!d) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.vacioTitulo}>No se encontró la entrega</Text>
        <Text style={styles.vacioTexto}>Puede que ya se haya eliminado.</Text>
      </View>
    );
  }

  const chip = estadoColor[d.estado] ?? estadoColor.pendiente;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>{d.cliente}</Text>
        <View style={[styles.chip, { backgroundColor: chip.bg }]}>
          <Text style={[styles.chipTexto, { color: chip.text }]}>
            {estadoLabel[d.estado]}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Fila icono="📍" etiqueta="Dirección" valor={d.direccion} />
        <View style={styles.separador} />
        <Fila icono="🛵" etiqueta="Repartidor" valor={d.repartidor} />
      </View>

      <View style={styles.totalCaja}>
        <Text style={styles.totalEtiqueta}>Total</Text>
        <Text style={styles.totalValor}>${Number(d.total).toFixed(2)}</Text>
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/delivery/seguimiento",
            params: { id: String(id) },
          })
        }
        style={({ pressed }) => [
          styles.botonPrincipal,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={styles.botonPrincipalTexto}>Ver seguimiento</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.push({ pathname: "/delivery/edit/[id]", params: { id } })
        }
        style={({ pressed }) => [
          styles.botonSecundario,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.botonSecundarioTexto}>Editar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 20, gap: 16 },
  centrado: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 6,
  },
  vacioTitulo: { fontSize: 18, fontWeight: "700", color: C.title },
  vacioTexto: { fontSize: 14, color: C.muted },

  encabezado: { gap: 10, alignItems: "flex-start" },
  titulo: { fontSize: 26, fontWeight: "800", color: C.title },
  chip: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999 },
  chipTexto: { fontSize: 13, fontWeight: "700" },

  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#0f3d3a",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
      default: { boxShadow: "0px 6px 16px rgba(15, 61, 58, 0.08)" },
    }),
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconoTexto: { fontSize: 18 },
  filaTexto: { flex: 1, gap: 2 },
  label: { fontSize: 12, fontWeight: "600", color: C.label },
  valor: { fontSize: 16, color: C.title },
  separador: { height: 1, backgroundColor: C.border, marginLeft: 54 },

  totalCaja: {
    backgroundColor: C.primarySoft,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalEtiqueta: { fontSize: 15, fontWeight: "600", color: C.label },
  totalValor: { fontSize: 28, fontWeight: "800", color: C.primary },

  botonPrincipal: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  botonPrincipalTexto: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  botonSecundario: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(23, 56, 62, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(23, 56, 62, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  botonSecundarioTexto: { color: "#5b6b68", fontSize: 15, fontWeight: "700" },
});
