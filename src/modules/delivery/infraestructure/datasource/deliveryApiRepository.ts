import { apiClient } from "@/core/http/api-client";
import axios from "axios";
import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepository } from "../../domain/ports/deliveryRepository";
import { DeliveryDto } from "../dto/deliveryDto";
import { toDelivery, toDto } from "../dto/deliveryMapper";

const esNoEncontrado = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;

export class DeliveryApiRepository implements DeliveryRepository {
  async getAll(): Promise<Delivery[]> {
    try {
      const res = await apiClient.get<DeliveryDto[]>("/deliveries");

      console.log("RESPUESTA:", res.data);

      if (!Array.isArray(res.data)) {
        throw new Error(
          "La API no devolvió una lista de entregas. Revisa la respuesta del backend.",
        );
      }

      return res.data.map(toDelivery);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("ERROR API:", error.message);
        console.log("URL:", error.config?.baseURL, error.config?.url);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
      } else {
        console.log("ERROR DESCONOCIDO:", String(error));
      }

      throw error;
    }
  }

  async getById(id: string): Promise<Delivery | undefined> {
    try {
      const res = await apiClient.get<DeliveryDto>(`/deliveries/${id}`);

      return toDelivery(res.data);
    } catch (error: unknown) {
      if (esNoEncontrado(error)) return undefined;
      throw error;
    }
  }

  async create(item: Omit<Delivery, "id">): Promise<Delivery> {
    const res = await apiClient.post<DeliveryDto>("/deliveries", toDto(item));

    return toDelivery(res.data);
  }

  async update(
    id: string,
    changes: Partial<Delivery>,
  ): Promise<Delivery | undefined> {
    try {
      const res = await apiClient.put<DeliveryDto>(
        `/deliveries/${id}`,
        toDto(changes),
      );

      return toDelivery(res.data);
    } catch (error: unknown) {
      if (esNoEncontrado(error)) return undefined;
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/deliveries/${id}`);
  }
}
