import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export const FruitsView = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Frutas</Text>
      <Text>Aquí se mostrará el listado de frutas.</Text>
      <Button title="Agregar fruta" onPress={() => router.push("/fruits/add")} />
      <Button title="Ver detalle" onPress={() => router.push("/fruits/details")} />
      <Button title="Ir al inicio" onPress={() => router.replace("/")} />
    </View>
  );
};