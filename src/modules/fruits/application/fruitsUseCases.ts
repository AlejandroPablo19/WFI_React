import { fetchFruitById, fetchFruits } from '../infraestructure/fruitsApi';

export const getFruits = () => fetchFruits();
export const getFruitById = (id: number) => fetchFruitById(id);