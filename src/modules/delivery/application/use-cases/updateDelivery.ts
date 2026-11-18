import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

export const updateDelivery = (
  repo: DeliveryRepository,
  id: string,
  data: Partial<Delivery>,
) => repo.update(id, data);
