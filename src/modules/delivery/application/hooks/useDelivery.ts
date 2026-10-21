import { apiClient } from "@/core/http/api-client";
import { useCallback, useEffect, useState } from "react";
import { Delivery } from "../../domain/entities/delivery";

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get<Delivery[]>("/deliveries");
      setDeliveries(response.data);
    } catch {
      setError("No se pudieron cargar las entregas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  return { deliveries, loading, error, reload: loadDeliveries };
}
