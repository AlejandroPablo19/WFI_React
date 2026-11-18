import { fetchFruitById, fetchFruits } from '../infraestructure/fruitsService';

export const getFruits = () => fetchFruits();
export const getFruitById = (id: string) => fetchFruitById(id);