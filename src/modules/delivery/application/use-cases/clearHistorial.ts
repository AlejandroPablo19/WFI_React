import { DeliveryRepository } from "../../domain/ports/deliveryRepository";
import { deleteDelivery } from "./deleteDelivery";
import { getHistorial } from "./getHistorial";

// Elimina todas las entregas finalizadas (entregadas y canceladas).
// Devuelve cuántas se eliminaron.
export const clearHistorial = async (
  repo: DeliveryRepository,
): Promise<number> => {
  const finalizadas = await getHistorial(repo);

  let eliminadas = 0;
  let fallidas = 0;

  for (const entrega of finalizadas) {
    try {
      await deleteDelivery(repo, String(entrega.id));
      eliminadas++;
    } catch (err) {
      console.error("No se pudo eliminar la entrega:", entrega.id, err);
      fallidas++;
    }
  }

  if (fallidas > 0) {
    throw new Error(
      `Se eliminaron ${eliminadas} y fallaron ${fallidas} entregas.`,
    );
  }

  return eliminadas;
};
