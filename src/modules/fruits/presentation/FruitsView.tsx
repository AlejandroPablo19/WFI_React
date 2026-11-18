import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Fruit } from "../domain/Fruit";
import { fetchFruits } from "../infraestructure/fruitsService";

export const FruitsView = () => {
  const router = useRouter();
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFruits()
      .then(setFruits)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#e8f4fd", padding: 20, gap: 12 }}>
      {/* Encabezado estilo "CONTROL DE EXISTENCIAS" */}
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#1b5e20" }}>
        LISTA DE FRUTAS 
      </Text>
      <Text style={{ fontSize: 14, color: "#666" }}>
        LISTA DE FRUTAS · Frutas sincronizadas en tiempo real con Firebase.
      </Text>

      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
      {!loading && !error && fruits.length === 0 && (
        <Text>No hay frutas en la colección.</Text>
      )}

      <FlatList
        data={fruits}
        keyExtractor={(f) => f.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: "/fruits/[id]", params: { id: item.id } })
            }
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontSize: 32 }}>{item.emoji ?? "🍏"}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1b5e20" }}>
              {item.name ?? item.id}
            </Text>
          </Pressable>
        )}
      />

      {/* Botón primario: Agregar fruta */}
      <Pressable
        onPress={() => router.push("/fruits/add")}
        style={{
          backgroundColor: "#1b5e20",
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "700" }}>
          + Agregar fruta
        </Text>
      </Pressable>

      {/* Botón secundario: Ir al inicio */}
      <Pressable
        onPress={() => router.replace("/")}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          borderColor: "#1b5e20",
          borderWidth: 1.5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
        }}
      >
        <Text style={{ color: "#1b5e20", fontSize: 16, fontWeight: "700" }}>
          Ir al inicio
        </Text>
      </Pressable>
    </View>
  );
};
