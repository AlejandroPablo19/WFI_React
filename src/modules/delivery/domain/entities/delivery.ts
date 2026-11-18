export type DeliveryStatus =
  | "pendiente"
  | "en_camino"
  | "entregado"
  | "cancelado";

export interface Delivery {
  id: string;
  cliente: string;
  direccion: string;
  repartidor: string;
  estado: DeliveryStatus;
  total: number;
}

export const estadoLabel: Record<DeliveryStatus, string> = {
  pendiente: "Pendiente",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
