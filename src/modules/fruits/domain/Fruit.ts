export interface Fruit {
  id: string;
  name?: string;
  emoji?: string;
  [key: string]: unknown;
}