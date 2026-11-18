import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

export async function deleteDelivery(
  repo: DeliveryRepository,
  id: string,
): Promise<void> {
  await repo.delete(id);
}
