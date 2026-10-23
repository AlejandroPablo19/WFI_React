import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";

type Errores = {
  cliente?: string;
  repartidor?: string;
  total?: string;
};

export function DeliveryAddView() {
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [repartidor, setRepartidor] = useState("");
  const [total, setTotal] = useState("");

  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const limpiarError = (campo: keyof Errores) => {
    if (errores[campo]) {
      setErrores((e) => ({ ...e, [campo]: undefined }));
      setErrorGeneral("");
    }
  };

  const continuar = () => {
    const nuevos: Errores = {};

    // Acepta coma o punto decimal (ej. 150,50)
    const totalLimpio = total.trim().replace(",", ".");
    const totalNum = Number(totalLimpio);

    if (!cliente.trim()) nuevos.cliente = "Escribe el nombre del cliente.";
    if (!repartidor.trim())
      nuevos.repartidor = "Escribe el nombre del repartidor.";

    if (!total.trim()) {
      nuevos.total = "Escribe el total.";
    } else if (isNaN(totalNum) || totalNum <= 0) {
      nuevos.total = "Ingresa un monto mayor a 0.";
    }

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      setErrorGeneral("Revisa los campos marcados en rojo.");
      return;
    }

    setErrorGeneral("");

    try {
      router.push({
        pathname: "/delivery/direccion",
        params: {
          cliente: cliente.trim(),
          repartidor: repartidor.trim(),
          total: String(totalNum),
        },
      });
    } catch (err) {
      console.error("Error al continuar a dirección:", err);
      setErrorGeneral("No se pudo continuar. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva entrega</Text>

      <View style={styles.campo}>
        <TextInput
          style={[styles.input, !!errores.cliente && styles.inputError]}
          placeholder="Cliente"
          placeholderTextColor={colors.muted}
          value={cliente}
          onChangeText={(t) => {
            setCliente(t);
            limpiarError("cliente");
          }}
        />
        {!!errores.cliente && (
          <Text style={styles.errorCampo}>{errores.cliente}</Text>
        )}
      </View>

      <View style={styles.campo}>
        <TextInput
          style={[styles.input, !!errores.repartidor && styles.inputError]}
          placeholder="Repartidor"
          placeholderTextColor={colors.muted}
          value={repartidor}
          onChangeText={(t) => {
            setRepartidor(t);
            limpiarError("repartidor");
          }}
        />
        {!!errores.repartidor && (
          <Text style={styles.errorCampo}>{errores.repartidor}</Text>
        )}
      </View>

      <View style={styles.campo}>
        <TextInput
          style={[styles.input, !!errores.total && styles.inputError]}
          placeholder="Total"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={total}
          onChangeText={(t) => {
            setTotal(t);
            limpiarError("total");
          }}
        />
        {!!errores.total && (
          <Text style={styles.errorCampo}>{errores.total}</Text>
        )}
      </View>

      {errorGeneral !== "" && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>{errorGeneral}</Text>
        </View>
      )}

      <DeliveryButton title="Continuar" onPress={continuar} />
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
