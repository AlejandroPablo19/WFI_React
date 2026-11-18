import { Alert, Platform } from "react-native";

export function mostrarAlerta(titulo: string, mensaje: string): Promise<void> {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensaje,
      [{ text: "Aceptar", onPress: () => resolve() }],
      // Evita que la promesa quede colgada si se cierra tocando fuera / atrás.
      { cancelable: true, onDismiss: () => resolve() },
    );
  });
}
