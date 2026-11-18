import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { mostrarAlerta } from "../../shared/utils/mostrarAlerta";
import { createDelivery } from "../use-cases/createDelivery";

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

export function DeliveryResumenView() {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);

  const { cliente, repartidor, total, calle, colonia, referencia } =
    useLocalSearchParams<{
      cliente: string;
      repartidor: string;
      total: string;
      calle: string;
      colonia: string;
      referencia: string;
    }>();

  const totalNumero = Number(total) || 0;

  const confirmar = async () => {
    if (guardando) return;

    try {
      setGuardando(true);

      await createDelivery(deliveryRepository, {
        cliente,
        repartidor,
        direccion: `${calle}, ${colonia}`,
        estado: "pendiente",
        total: totalNumero,
      });

      setGuardando(false);
      void mostrarAlerta(
        "Entrega creada",
        "La entrega se registró correctamente.",
      );
      router.dismissAll();
    } catch (err) {
      console.error("Error al crear la entrega:", err);
      setGuardando(false);
      void mostrarAlerta(
        "Error",
        "No se pudo registrar la entrega. Revisa tu conexión.",
      );
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Resumen de entrega</Text>
        <Text style={styles.subtitulo}>
          Revisa los datos antes de confirmar.
        </Text>
      </View>

      <View style={styles.card}>
        <Fila icono="👤" etiqueta="Cliente" valor={cliente ?? "-"} />
        <View style={styles.separador} />
        <Fila icono="🛵" etiqueta="Repartidor" valor={repartidor ?? "-"} />
        <View style={styles.separador} />
        <Fila
          icono="📍"
          etiqueta="Dirección"
          valor={`${calle ?? ""}, ${colonia ?? ""}`}
        />
        {!!referencia && (
          <>
            <View style={styles.separador} />
            <Fila icono="📝" etiqueta="Referencias" valor={referencia} />
          </>
        )}
      </View>

      <View style={styles.totalCaja}>
        <Text style={styles.totalEtiqueta}>Total a cobrar</Text>
        <Text style={styles.totalValor}>${totalNumero.toFixed(2)}</Text>
      </View>

      <Pressable
        onPress={() => void confirmar()}
        disabled={guardando}
        style={({ pressed }) => [
          styles.botonPrincipal,
          guardando && styles.botonDeshabilitado,
          pressed && !guardando && { opacity: 0.85 },
        ]}
      >
        {guardando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.botonPrincipalTexto}>Confirmar entrega</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        disabled={guardando}
        style={({ pressed }) => [
          styles.botonSecundario,
          guardando && { opacity: 0.5 },
          pressed && !guardando && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.botonSecundarioTexto}>Volver y editar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 20, gap: 16 },

  encabezado: { gap: 4, marginBottom: 4 },
  titulo: { fontSize: 26, fontWeight: "800", color: C.title },
  subtitulo: { fontSize: 14, color: C.muted },

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
  botonDeshabilitado: { backgroundColor: "#87bbaf" },
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
