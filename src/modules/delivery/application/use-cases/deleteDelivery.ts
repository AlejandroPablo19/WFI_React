import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

export const deleteDelivery = (repo: DeliveryRepository, id: string) =>
  repo.delete(id);
