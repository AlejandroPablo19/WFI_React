import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

// Entregas activas (pendientes y en camino)
export const getDeliveries = async (repo: DeliveryRepository) => {
  const all = await repo.getAll();
  return all.filter(
    (d) => d.estado === "pendiente" || d.estado === "en_camino",
  );
};
