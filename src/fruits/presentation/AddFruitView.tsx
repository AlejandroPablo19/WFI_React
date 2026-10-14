import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export const AddFruitView = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Agregar fruta</Text>
      <Text>Aquí irá el formulario para agregar una fruta.</Text>
      <Button title="Volver al listado" onPress={() => router.back()} />
    </View>
  );
};