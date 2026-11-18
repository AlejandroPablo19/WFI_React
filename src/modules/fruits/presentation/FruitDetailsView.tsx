import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Fruit } from "../domain/Fruit";
import { fetchFruitById } from "../infraestructure/fruitsService";

export const FruitDetailsView = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fruit, setFruit] = useState<Fruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFruitById(String(id))
      .then(setFruit)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Muestra todos los campos del documento, tengan los que tengan
  const entries = fruit
    ? Object.entries(fruit).filter(
        ([k]) => k !== "id" && k !== "name" && k !== "emoji"
      )
    : [];

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: "#e8f4fd", padding: 20, gap: 12 }}
    >
      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
      {!loading && !error && !fruit && <Text>Fruta no encontrada</Text>}

      {fruit && (
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 80, textAlign: "center" }}>{fruit.emoji ?? "🍏"}</Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center",
              color: "#1b5e20",
            }}
          >
            {fruit.name ?? fruit.id}
          </Text>

          {entries.map(([key, value]) => (
            <View
              key={key}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#e0e0e0",
              }}
            >
              <Text style={{ fontSize: 16, textTransform: "capitalize", color: "#555" }}>
                {key}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#1b5e20" }}>
                {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Botón secundario: Volver al listado */}
      <Pressable
        onPress={() => router.back()}
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
          ← Volver al listado
        </Text>
      </Pressable>
    </ScrollView>
  );
};
