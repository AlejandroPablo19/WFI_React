import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

export const createDelivery = (
  repo: DeliveryRepository,
  data: Omit<Delivery, "id">,
) => repo.create(data);
