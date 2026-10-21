import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";
import { getDeliveryById } from "../use-cases/getDeliveryById";
import { updateDelivery } from "../use-cases/updateDelivery";

export function DeliveryEditView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [repartidor, setRepartidor] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    getDeliveryById(deliveryRepository, id).then((d) => {
      if (!d) return;
      setCliente(d.cliente);
      setDireccion(d.direccion);
      setRepartidor(d.repartidor);
      setTotal(String(d.total));
    });
  }, [id]);

  const guardar = async () => {
    const totalNum = Number(total);

    if (!cliente.trim() || !direccion.trim() || !repartidor.trim()) {
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }
    if (isNaN(totalNum) || totalNum <= 0) {
      Alert.alert("Total inválido", "Ingresa un monto mayor a 0.");
      return;
    }
    try {
      await updateDelivery(deliveryRepository, id, {
        cliente: cliente.trim(),
        direccion: direccion.trim(),
        repartidor: repartidor.trim(),
        total: totalNum,
      });
      router.back();
    } catch {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Repartidor"
        value={repartidor}
        onChangeText={setRepartidor}
      />
      <TextInput
        style={styles.input}
        placeholder="Total"
        keyboardType="numeric"
        value={total}
        onChangeText={setTotal}
      />
      <Button title="Guardar cambios" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
});
