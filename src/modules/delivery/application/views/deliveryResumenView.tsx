import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { createDelivery } from "../use-cases/createDelivery";

export function DeliveryResumenView() {
  const router = useRouter();
  const { cliente, repartidor, total, calle, colonia, referencia } =
    useLocalSearchParams<{
      cliente: string;
      repartidor: string;
      total: string;
      calle: string;
      colonia: string;
      referencia: string;
    }>();

  const confirmar = async () => {
    try {
      await createDelivery(deliveryRepository, {
        cliente,
        repartidor,
        direccion: `${calle}, ${colonia}`,
        estado: "pendiente",
        total: Number(total) || 0,
      });
      Alert.alert("Entrega creada", "La entrega se registró correctamente.");
      router.dismissAll();
    } catch {
      Alert.alert(
        "Error",
        "No se pudo registrar la entrega. Revisa tu conexión.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Resumen de entrega</Text>
      <Text>Cliente: {cliente}</Text>
      <Text>Repartidor: {repartidor}</Text>
      <Text>
        Dirección: {calle}, {colonia}
      </Text>
      {!!referencia && <Text>Referencias: {referencia}</Text>}
      <View style={styles.line} />
      <Text style={styles.total}>Total: ${total}</Text>
      <Button title="Confirmar entrega" onPress={confirmar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  line: { borderBottomWidth: 1, borderColor: "#ddd", marginVertical: 6 },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
});
