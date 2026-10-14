import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export const FruitDetailsView = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Detalle de la fruta</Text>
      <Text>Aquí se mostrará la información de la fruta seleccionada.</Text>
      <Button title="Volver al listado" onPress={() => router.back()} />
    </View>
  );
};