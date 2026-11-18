import { useCallback, useEffect, useState } from "react";
import { Delivery } from "../../domain/entities/delivery";
import { deliveryRepository } from "../../infraestructure/deliveryRepositori";

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      setDeliveries(await deliveryRepository.getAll());
    } catch {
      setError("No se pudieron cargar las entregas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadDeliveries();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDeliveries]);

  return { deliveries, loading, error, reload: loadDeliveries };
}
