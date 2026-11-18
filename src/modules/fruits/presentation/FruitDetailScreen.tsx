import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Fruit } from '../domain/Fruit';
import { fetchFruitById } from '../infraestructure/fruitsService';

export default function FruitDetailScreen() {
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

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!fruit) return <Text style={styles.error}>Fruta no encontrada</Text>;

  // Muestra todos los campos del documento, sea cual sea su estructura
  const entries = Object.entries(fruit).filter(
    ([key]) => key !== 'id' && key !== 'name' && key !== 'emoji'
  );

  return (
    <ScrollView style={{ backgroundColor: '#f6f7f2' }}>
      <View style={styles.header}>
        <Text style={{ fontSize: 90 }}>{fruit.emoji ?? '🍏'}</Text>
        <Text style={styles.title}>{fruit.name ?? fruit.id}</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.tableTitle}>Detalles</Text>
        {entries.map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.value}>
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  error: { padding: 16, color: 'red' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#e8f0dc', gap: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2d4a1e' },
  tableTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 12,
  },
  label: { fontSize: 16, textTransform: 'capitalize' },
  value: { fontSize: 16, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});