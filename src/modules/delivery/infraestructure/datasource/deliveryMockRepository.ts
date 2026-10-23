import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

let data: Delivery[] = [
  // {
  //   id: "1",
  //   cliente: "María López",
  //   direccion: "Calle 5 de Mayo #12",
  //   repartidor: "Juan",
  //   estado: "pendiente",
  //   total: 98,
  // },
  // {
  //   id: "2",
  //   cliente: "Pedro Ruiz",
  //   direccion: "Av. Reforma #340",
  //   repartidor: "Luis",
  //   estado: "en_camino",
  //   total: 75,
  // },
  // {
  //   id: "3",
  //   cliente: "Ana Torres",
  //   direccion: "Calle Hidalgo #8",
  //   repartidor: "Juan",
  //   estado: "entregado",
  //   total: 120,
  // },
  // {
  //   id: "4",
  //   cliente: "Carlos Díaz",
  //   direccion: "Blvd. Norte #55",
  //   repartidor: "Luis",
  //   estado: "cancelado",
  //   total: 40,
  // },
];

export class DeliveryMockRepository implements DeliveryRepository {
  async getAll() {
    return [...data];
  }

  async getById(id: string) {
    return data.find((d) => d.id === id);
  }

  async create(item: Omit<Delivery, "id">) {
    const nuevo: Delivery = { ...item, id: String(Date.now()) };
    data = [nuevo, ...data];
    return nuevo;
  }

  async update(id: string, changes: Partial<Delivery>) {
    data = data.map((d) => (d.id === id ? { ...d, ...changes } : d));
    return data.find((d) => d.id === id);
  }

  async delete(id: string) {
    data = data.filter((d) => d.id !== id);
  }
}
