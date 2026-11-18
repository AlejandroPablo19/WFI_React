import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepository } from "../../domain/ports/deliveryRepository";
import { toDelivery, toDto } from "../dto/deliveryMapper";

const deliveriesCollection = "deliveries";

export class DeliveryFirebaseRepository implements DeliveryRepository {
  async getAll(): Promise<Delivery[]> {
    const snapshot = await getDocs(collection(db, deliveriesCollection));
    return snapshot.docs.map((delivery) =>
      toDelivery(delivery.id, delivery.data()),
    );
  }

  async getById(id: string): Promise<Delivery | undefined> {
    const snapshot = await getDoc(doc(db, deliveriesCollection, id));
    return snapshot.exists()
      ? toDelivery(snapshot.id, snapshot.data())
      : undefined;
  }

  async create(item: Omit<Delivery, "id">): Promise<Delivery> {
    const reference = await addDoc(
      collection(db, deliveriesCollection),
      toDto(item),
    );
    return { ...item, id: reference.id };
  }

  async update(
    id: string,
    changes: Partial<Delivery>,
  ): Promise<Delivery | undefined> {
    const reference = doc(db, deliveriesCollection, id);
    const changesWithoutId = toDto(changes);

    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists()) return undefined;

      const updatedData = { ...snapshot.data(), ...changesWithoutId };
      transaction.update(reference, changesWithoutId);
      return toDelivery(snapshot.id, updatedData);
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, deliveriesCollection, id));
  }
}
