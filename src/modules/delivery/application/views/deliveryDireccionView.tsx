import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

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

  const guardar = () => {
    if (!calle.trim() || !colonia.trim()) {
      Alert.alert("Faltan datos", "Completa calle y colonia.");
      return;
    }
    router.push({
      pathname: "/delivery/resumen",
      params: { cliente, repartidor, total, calle, colonia, referencia },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Dirección de entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="Calle y número"
        value={calle}
        onChangeText={setCalle}
      />
      <TextInput
        style={styles.input}
        placeholder="Colonia"
        value={colonia}
        onChangeText={setColonia}
      />
      <TextInput
        style={styles.input}
        placeholder="Referencias"
        value={referencia}
        onChangeText={setReferencia}
      />
      <Button title="Guardar dirección" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10 },
});
