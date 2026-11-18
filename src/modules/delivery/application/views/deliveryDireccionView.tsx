import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";

type Errores = {
  calle?: string;
  colonia?: string;
};

export function DeliveryDireccionView() {
  const router = useRouter();
  const { cliente, repartidor, total } = useLocalSearchParams<{
    cliente: string;
    repartidor: string;
    total: string;
  }>();

  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [referencia, setReferencia] = useState("");

  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const guardar = () => {
    const nuevos: Errores = {};

    if (!calle.trim()) nuevos.calle = "Escribe la calle y el número.";
    if (!colonia.trim()) nuevos.colonia = "Escribe la colonia.";

    setErrores(nuevos);

    // Campos vacíos
    if (Object.keys(nuevos).length > 0) {
      setErrorGeneral("Faltan datos: completa los campos marcados en rojo.");
      return;
    }

    // Datos del paso anterior
    if (!cliente || !repartidor || !total) {
      setErrorGeneral(
        "No se recibieron los datos del pedido. Regresa e inténtalo de nuevo.",
      );
      return;
    }

    setErrorGeneral("");

    try {
      router.push({
        pathname: "/delivery/resumen",
        params: { cliente, repartidor, total, calle, colonia, referencia },
      });
    } catch (err) {
      console.error("Error al continuar al resumen:", err);
      setErrorGeneral("No se pudo continuar. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Dirección de entrega</Text>

      <View style={styles.campo}>
        <TextInput
          style={[styles.input, !!errores.calle && styles.inputError]}
          placeholder="Calle y número"
          placeholderTextColor={colors.muted}
          value={calle}
          onChangeText={(t) => {
            setCalle(t);
            if (errores.calle) {
              setErrores((e) => ({ ...e, calle: undefined }));
              setErrorGeneral("");
            }
          }}
        />
        {!!errores.calle && (
          <Text style={styles.errorCampo}>{errores.calle}</Text>
        )}
      </View>

      <View style={styles.campo}>
        <TextInput
          style={[styles.input, !!errores.colonia && styles.inputError]}
          placeholder="Colonia"
          placeholderTextColor={colors.muted}
          value={colonia}
          onChangeText={(t) => {
            setColonia(t);
            if (errores.colonia) {
              setErrores((e) => ({ ...e, colonia: undefined }));
              setErrorGeneral("");
            }
          }}
        />
        {!!errores.colonia && (
          <Text style={styles.errorCampo}>{errores.colonia}</Text>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Referencias (opcional)"
        placeholderTextColor={colors.muted}
        value={referencia}
        onChangeText={setReferencia}
      />

      {errorGeneral !== "" && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>{errorGeneral}</Text>
        </View>
      )}

      <DeliveryButton title="Guardar dirección" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.title,
  },
  campo: {
    gap: 4,
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.title,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  errorCampo: {
    color: colors.danger,
    fontSize: 12,
    marginLeft: 4,
  },
  alerta: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 12,
  },
  alertaTexto: {
    color: colors.danger,
    fontSize: 14,
  },
});
