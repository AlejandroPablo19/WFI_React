import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

export const getDeliveryById = (repo: DeliveryRepository, id: string) =>
  repo.getById(id);
