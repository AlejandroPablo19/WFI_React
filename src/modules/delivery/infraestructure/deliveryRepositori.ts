import { DeliveryRepository } from "../domain/ports/deliveryRepository";
import { DeliveryFirebaseRepository } from "./datasource/deliveryFirebaseRepository";
import { DeliveryMockRepository } from "./datasource/deliveryMockRepository";

// false = consumir datos de Firebase
// true = usar datos simulados
const USE_MOCK = false;

export const deliveryRepository: DeliveryRepository = USE_MOCK
  ? new DeliveryMockRepository()
  : new DeliveryFirebaseRepository();
