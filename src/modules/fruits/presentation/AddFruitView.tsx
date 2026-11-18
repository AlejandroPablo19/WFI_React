import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { addFruit } from "../infraestructure/fruitsService";

export const AddFruitView = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("piezas");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !quantity.trim()) {
      Alert.alert("Faltan datos", "Escribe el nombre y la cantidad.");
      return;
    }

    try {
      setSaving(true);
      await addFruit({
        name: name.trim(),
        quantity: quantity.trim(),
        unit: unit.trim() || "piezas",
      });
      Alert.alert("Listo", "Fruta guardada en Firebase.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error al guardar", e.message);
    } finally {
      setSaving(false);
    }
  };

  const input = {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  } as const;

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: "#e8f4fd", padding: 20, gap: 12 }}
    >
      {/* Título */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
        Agregar fruta
      </Text>

      {/* Tarjeta blanca del formulario */}
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
        <Text style={{ fontSize: 12, color: "#4caf50", letterSpacing: 1 }}>
          NUEVA FRUTA
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1b5e20", marginTop: 4 }}>
          Agregar fruta
        </Text>
        <Text style={{ fontSize: 14, color: "#777", marginTop: 4 }}>
          Completa los datos para agregarla a la lista.
        </Text>

        <Text style={{ fontSize: 14, color: "#555", marginTop: 16 }}>Nombre</Text>
        <TextInput
          style={input}
          value={name}
          onChangeText={setName}
          placeholder="Ej. Manzana"
        />

        <Text style={{ fontSize: 14, color: "#555", marginTop: 12 }}>Cantidad</Text>
        <TextInput
          style={input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Ej. 25"
          keyboardType="numeric"
        />

        <Text style={{ fontSize: 14, color: "#555", marginTop: 12 }}>Unidad</Text>
        <TextInput
          style={input}
          value={unit}
          onChangeText={setUnit}
          placeholder="Ej. piezas"
        />

        {saving ? (
          <ActivityIndicator size="large" />
        ) : (
          <Pressable
            onPress={handleSave}
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
             Guardar
            </Text>
          </Pressable>
        )}
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
      </View>
    </ScrollView>
  );
};
