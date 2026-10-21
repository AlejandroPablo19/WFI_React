import { Delivery } from "../../domain/entities/delivery";
import { DeliveryDto } from "./deliveryDto";

export const toDelivery = (dto: DeliveryDto): Delivery => ({
  id: String(dto.id),
  cliente: dto.cliente,
  direccion: dto.direccion,
  repartidor: dto.repartidor,
  estado: dto.estado as Delivery["estado"],
  total: Number(dto.total),
});

export const toDto = (d: Partial<Delivery>) => {
  const { id, ...rest } = d;
  return rest;
};
