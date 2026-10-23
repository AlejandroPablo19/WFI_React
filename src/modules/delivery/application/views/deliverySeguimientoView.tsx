import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Delivery, DeliveryStatus } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";
import { mostrarAlerta } from "../../shared/utils/mostrarAlerta";
import { getDeliveryById } from "../use-cases/getDeliveryById";

const estados: {
  valor: DeliveryStatus;
  etiqueta: string;
  descripcion: string;
}[] = [
  {
    valor: "pendiente",
    etiqueta: "Pendiente",
    descripcion: "Pedido recibido",
  },
  {
    valor: "en_camino",
    etiqueta: "En camino",
    descripcion: "El repartidor lleva el pedido",
  },
  {
    valor: "entregado",
    etiqueta: "Entregado",
    descripcion: "Pedido recibido por el cliente",
  },
  {
    valor: "cancelado",
    etiqueta: "Cancelado",
    descripcion: "Pedido cancelado",
  },
];

// Color de cada estado: fondo translúcido, texto fuerte y punto.
const estadoColor: Record<
  DeliveryStatus,
  { bg: string; text: string; dot: string }
> = {
  pendiente: {
    bg: "rgba(217, 140, 30, 0.15)",
    text: "#a8650a",
    dot: "#d98c1e",
  },
  en_camino: {
    bg: "rgba(30, 120, 190, 0.15)",
    text: "#1a6aa5",
    dot: "#1e78be",
  },
  entregado: {
    bg: "rgba(15, 119, 95, 0.15)",
    text: "#0f775f",
    dot: "#0f775f",
  },
  cancelado: {
    bg: "rgba(217, 83, 79, 0.15)",
    text: "#b8332f",
    dot: "#d9534f",
  },
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

export function DeliverySeguimientoView() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [delivery, setDelivery] = useState<Delivery | undefined>();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<
    DeliveryStatus | undefined
  >();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargarEntrega = useCallback(async () => {
    if (!id) {
      setError("No se recibió el ID de la entrega.");
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError("");

      const resultado = await getDeliveryById(deliveryRepository, String(id));

      if (!resultado) {
        setDelivery(undefined);
        setEstadoSeleccionado(undefined);
        setError("No se encontró la entrega.");
        return;
      }

      setDelivery(resultado);
      setEstadoSeleccionado(resultado.estado);
    } catch (e) {
      console.error("Error al cargar entrega:", e);
      setError("No se pudo cargar la entrega.");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarEntrega();
  }, [cargarEntrega]);

  const actualizarEstado = async () => {
    if (!delivery || !estadoSeleccionado) return;

    try {
      setGuardando(true);

      const actualizada = await deliveryRepository.update(delivery.id, {
        estado: estadoSeleccionado,
      });

      if (!actualizada) {
        throw new Error("No se encontró la entrega actualizada.");
      }

      setDelivery(actualizada);
      setEstadoSeleccionado(actualizada.estado);
      setGuardando(false);

      // Sin await: no deja el botón bloqueado mientras la alerta está abierta.
      void mostrarAlerta(
        "Estado actualizado",
        `El pedido ahora está: ${
          estados.find((e) => e.valor === actualizada.estado)?.etiqueta ??
          actualizada.estado
        }.`,
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setGuardando(false);

      void mostrarAlerta(
        "Error",
        "No se pudo actualizar el estado del pedido.",
      );
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.textoCentrado}>Cargando entrega...</Text>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.textoCentrado}>
          {error || "No se encontró la entrega."}
        </Text>
        <View style={styles.botonAncho}>
          <DeliveryButton title="Reintentar" onPress={cargarEntrega} />
        </View>
      </View>
    );
  }

  const pasos = estados.filter((e) => e.valor !== "cancelado");
  const pasoActual = pasos.findIndex((e) => e.valor === delivery.estado);
  const cancelado = delivery.estado === "cancelado";
  const chip = estadoColor[delivery.estado];
  const etiquetaActual =
    estados.find((e) => e.valor === delivery.estado)?.etiqueta ??
    delivery.estado;
  const sinCambios = estadoSeleccionado === delivery.estado;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Seguimiento del pedido</Text>
        <View style={[styles.chip, { backgroundColor: chip.bg }]}>
          <View style={[styles.chipPunto, { backgroundColor: chip.dot }]} />
          <Text style={[styles.chipTexto, { color: chip.text }]}>
            {etiquetaActual}
          </Text>
        </View>
      </View>

      {/* Datos del pedido */}
      <View style={styles.card}>
        <Fila icono="👤" etiqueta="Cliente" valor={delivery.cliente} />
        <View style={styles.separador} />
        <Fila icono="📍" etiqueta="Dirección" valor={delivery.direccion} />
        <View style={styles.separador} />
        <Fila icono="🛵" etiqueta="Repartidor" valor={delivery.repartidor} />
      </View>

      <View style={styles.totalCaja}>
        <Text style={styles.totalEtiqueta}>Total</Text>
        <Text style={styles.totalValor}>
          ${Number(delivery.total).toFixed(2)}
        </Text>
      </View>

      {/* Progreso */}
      <Text style={styles.seccion}>Progreso del pedido</Text>

      {cancelado ? (
        <View style={styles.bannerCancelado}>
          <Text style={styles.bannerTitulo}>Pedido cancelado</Text>
          <Text style={styles.bannerTexto}>
            Este pedido ya no continuará su recorrido.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          {pasos.map((paso, index) => {
            const hecho = index < pasoActual;
            const actual = index === pasoActual;
            const ultimo = index === pasos.length - 1;

            return (
              <View key={paso.valor} style={styles.pasoFila}>
                <View style={styles.pasoIzq}>
                  <View
                    style={[
                      styles.punto,
                      hecho && styles.puntoHecho,
                      actual && styles.puntoActual,
                    ]}
                  >
                    {hecho && <Text style={styles.check}>✓</Text>}
                    {actual && <View style={styles.puntoCentro} />}
                  </View>
                  {!ultimo && (
                    <View style={[styles.linea, hecho && styles.lineaHecha]} />
                  )}
                </View>

                <View style={styles.pasoTexto}>
                  <Text
                    style={[
                      styles.pasoTitulo,
                      (hecho || actual) && styles.pasoTituloActivo,
                    ]}
                  >
                    {paso.etiqueta}
                  </Text>
                  <Text style={styles.ayuda}>{paso.descripcion}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Cambiar estado */}
      <Text style={styles.seccion}>Cambiar estado</Text>
      <Text style={styles.ayuda}>
        Selecciona el nuevo estado y guarda los cambios.
      </Text>

      {estados.map((estado) => {
        const seleccionado = estadoSeleccionado === estado.valor;
        const c = estadoColor[estado.valor];

        return (
          <Pressable
            key={estado.valor}
            onPress={() => setEstadoSeleccionado(estado.valor)}
            disabled={guardando}
            style={({ pressed }) => [
              styles.opcion,
              seleccionado && styles.opcionSeleccionada,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={styles.opcionFila}>
              <View
                style={[
                  styles.radio,
                  seleccionado && { borderColor: colors.primary },
                ]}
              >
                {seleccionado && <View style={styles.radioInterior} />}
              </View>

              <View style={styles.flex}>
                <Text style={styles.opcionTitulo}>{estado.etiqueta}</Text>
                <Text style={styles.ayuda}>{estado.descripcion}</Text>
              </View>

              <View style={[styles.opcionPunto, { backgroundColor: c.dot }]} />
            </View>
          </Pressable>
        );
      })}

      {error !== "" && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>{error}</Text>
        </View>
      )}

      <DeliveryButton
        title={guardando ? "Guardando..." : "Guardar estado"}
        disabled={guardando || sinCambios}
        onPress={() => void actualizarEstado()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },

  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
    backgroundColor: colors.background,
  },
  textoCentrado: { color: colors.title },
  botonAncho: { alignSelf: "stretch" },

  // Encabezado
  encabezado: { gap: 10, alignItems: "flex-start", marginBottom: 4 },
  titulo: { fontSize: 26, fontWeight: "800", color: colors.title },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipPunto: { width: 8, height: 8, borderRadius: 4 },
  chipTexto: { fontSize: 13, fontWeight: "700" },

  // Tarjeta de datos
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconoTexto: { fontSize: 18 },
  filaTexto: { flex: 1, gap: 2 },
  label: { fontSize: 12, fontWeight: "600", color: colors.label },
  valor: { fontSize: 16, color: colors.title },
  separador: { height: 1, backgroundColor: colors.border, marginLeft: 54 },

  // Total
  totalCaja: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalEtiqueta: { fontSize: 15, fontWeight: "600", color: colors.label },
  totalValor: { fontSize: 28, fontWeight: "800", color: colors.primary },

  // Secciones
  seccion: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.title,
    marginTop: 8,
  },
  ayuda: { color: colors.muted, fontSize: 13 },

  // Línea de tiempo
  pasoFila: { flexDirection: "row", gap: 14 },
  pasoIzq: { alignItems: "center", paddingTop: 14 },
  punto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  puntoHecho: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  puntoActual: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  puntoCentro: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  check: { color: "#ffffff", fontSize: 13, fontWeight: "800" },
  linea: {
    flex: 1,
    width: 2,
    minHeight: 24,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  lineaHecha: { backgroundColor: colors.primary },
  pasoTexto: { flex: 1, paddingVertical: 12, gap: 2 },
  pasoTitulo: { fontSize: 16, fontWeight: "600", color: colors.muted },
  pasoTituloActivo: { color: colors.title },

  // Cancelado
  bannerCancelado: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  bannerTitulo: { fontSize: 16, fontWeight: "800", color: colors.danger },
  bannerTexto: { fontSize: 14, color: colors.danger },

  // Opciones de estado
  opcion: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  opcionSeleccionada: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  opcionFila: { flexDirection: "row", alignItems: "center", gap: 12 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInterior: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  opcionTitulo: { fontSize: 16, fontWeight: "700", color: colors.title },
  opcionPunto: { width: 10, height: 10, borderRadius: 5 },

  // Error
  alerta: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 12,
  },
  alertaTexto: { color: colors.danger, fontSize: 14 },
});
