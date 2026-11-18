import { Delivery } from "../entities/delivery";

export interface DeliveryRepository {
  getAll(): Promise<Delivery[]>;
  getById(id: string): Promise<Delivery | undefined>;
  create(data: Omit<Delivery, "id">): Promise<Delivery>;
  update(id: string, data: Partial<Delivery>): Promise<Delivery | undefined>;
  delete(id: string): Promise<void>;
}
