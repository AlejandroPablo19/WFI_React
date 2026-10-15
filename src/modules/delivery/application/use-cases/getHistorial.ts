import { DeliveryRepository } from "../../domain/ports/deliveryRepository";

// Entregas finalizadas (entregadas y canceladas)
export const getHistorial = async (repo: DeliveryRepository) => {
  const all = await repo.getAll();
  return all.filter(
    (d) => d.estado === "entregado" || d.estado === "cancelado",
  );
};
