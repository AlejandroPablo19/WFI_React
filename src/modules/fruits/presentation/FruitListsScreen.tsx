import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Fruit } from '../domain/Fruit';
import { fetchFruits } from '../infraestructure/fruitsService';

export default function FruitsListScreen() {
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

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (fruits.length === 0)
    return <Text style={styles.error}>No hay frutas en la colección</Text>;

  return (
    <FlatList
      data={fruits}
      keyExtractor={(f) => f.id}
      style={{ backgroundColor: '#f6f7f2' }}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({ pathname: '/fruits/[id]', params: { id: item.id } })
          }
        >
          <Text></Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name ?? item.id}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  error: { padding: 16, color: 'red' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0dc',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    gap: 14,
  },
  emoji: { fontSize: 36 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2d4a1e' },
});