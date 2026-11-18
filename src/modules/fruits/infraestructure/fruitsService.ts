import { addDoc, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import '../../../shared/config/firebase';
import { Fruit } from '../domain/Fruit';

const COLLECTION = 'fruits';
const db = getFirestore();

export async function fetchFruits(): Promise<Fruit[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? 'Sin nombre',
      quantity: String(data.quantity ?? ''),
      unit: data.unit ?? '',
    };
  });
}

export async function fetchFruitById(id: string): Promise<Fruit | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? 'Sin nombre',
    quantity: String(data.quantity ?? ''),
    unit: data.unit ?? '',
  };
}

export async function addFruit(data: {
  name: string;
  quantity: string;
  unit: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}