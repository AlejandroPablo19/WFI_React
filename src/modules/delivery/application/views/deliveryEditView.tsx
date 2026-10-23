import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { DeliveryButton } from "../../shared/components/deliveryButton";
import { colors } from "../../shared/theme/colors";
import { getDeliveryById } from "../use-cases/getDeliveryById";
import { updateDelivery } from "../use-cases/updateDelivery";

type Errores = {
  cliente?: string;
  direccion?: string;
  repartidor?: string;
  total?: string;
};

export function DeliveryEditView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [repartidor, setRepartidor] = useState("");
  const [total, setTotal] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    setCargando(true);
    setErrorGeneral("");

    getDeliveryById(deliveryRepository, id)
      .then((d) => {
        if (!d) {
          setErrorGeneral("No se encontró la entrega.");
          return;
        }
        setCliente(d.cliente);
        setDireccion(d.direccion);
        setRepartidor(d.repartidor);
        setTotal(String(d.total));
      })
      .catch((err) => {
        console.error("Error al cargar la entrega:", err);
        setErrorGeneral("No se pudo cargar la entrega.");
      })
      .finally(() => setCargando(false));
  }, [id]);

  const limpiarError = (campo: keyof Errores) => {
    if (errores[campo]) {
      setErrores((e) => ({ ...e, [campo]: undefined }));
      setErrorGeneral("");
    }
  };

  const guardar = async () => {
    if (guardando) return;

    const nuevos: Errores = {};

    // Acepta coma o punto decimal (ej. 150,50)
    const totalNum = Number(total.trim().replace(",", "."));

    if (!cliente.trim()) nuevos.cliente = "Escribe el nombre del cliente.";
    if (!direccion.trim()) nuevos.direccion = "Escribe la dirección.";
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
      setGuardando(true);

      await updateDelivery(deliveryRepository, id, {
        cliente: cliente.trim(),
        direccion: direccion.trim(),
        repartidor: repartidor.trim(),
        total: totalNum,
      });

      router.back();
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
      setErrorGeneral(
        "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar entrega</Text>

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
          style={[styles.input, !!errores.direccion && styles.inputError]}
          placeholder="Dirección"
          placeholderTextColor={colors.muted}
          value={direccion}
          onChangeText={(t) => {
            setDireccion(t);
            limpiarError("direccion");
          }}
        />
        {!!errores.direccion && (
          <Text style={styles.errorCampo}>{errores.direccion}</Text>
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

      <DeliveryButton
        title={guardando ? "Guardando..." : "Guardar cambios"}
        disabled={guardando}
        onPress={() => void guardar()}
      />
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
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
