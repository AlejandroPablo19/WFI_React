import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export function DeliveryAddView() {
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [repartidor, setRepartidor] = useState("");
  const [total, setTotal] = useState("");

  const continuar = () => {
    const totalNum = Number(total);

    if (!cliente.trim() || !repartidor.trim() || !total.trim()) {
      Alert.alert("Faltan datos", "Completa cliente, repartidor y total.");
      return;
    }
    if (isNaN(totalNum) || totalNum <= 0) {
      Alert.alert("Total inválido", "Ingresa un monto mayor a 0.");
      return;
    }
    router.push({
      pathname: "/delivery/direccion",
      params: { cliente: cliente.trim(), repartidor: repartidor.trim(), total },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={cliente}
        onChangeText={setCliente}
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
      <Button title="Continuar" onPress={continuar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
});
