import { Delivery } from "../../domain/entities/delivery";

const esEstadoValido = (estado: unknown): estado is Delivery["estado"] =>
  estado === "pendiente" ||
  estado === "en_camino" ||
  estado === "entregado" ||
  estado === "cancelado";

export const toDelivery = (id: string, data: unknown): Delivery => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(`La entrega ${id} tiene un formato inválido.`);
  }

  const record = data as Record<string, unknown>;
  const total =
    typeof record.total === "number" ||
    (typeof record.total === "string" && record.total.trim() !== "")
      ? Number(record.total)
      : Number.NaN;

  if (
    typeof record.cliente !== "string" ||
    typeof record.direccion !== "string" ||
    typeof record.repartidor !== "string" ||
    !esEstadoValido(record.estado) ||
    !Number.isFinite(total)
  ) {
    throw new Error(`La entrega ${id} tiene campos inválidos.`);
  }

  return {
    id,
    cliente: record.cliente,
    direccion: record.direccion,
    repartidor: record.repartidor,
    estado: record.estado,
    total,
  };
};

export const toDto = (d: Partial<Delivery>) => {
  const { id, ...rest } = d;
  return rest;
};
