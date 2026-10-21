import { DeliveryRepository } from "../domain/ports/deliveryRepository";
import { DeliveryApiRepository } from "./datasource/deliveryApiRepository";
import { DeliveryMockRepository } from "./datasource/deliveryMockRepository";

// false = consumir datos del backend NestJS
// true = usar datos simulados
const USE_MOCK = false;

export const deliveryRepository: DeliveryRepository = USE_MOCK
  ? new DeliveryMockRepository()
  : new DeliveryApiRepository();
