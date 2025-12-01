import { QueueIndicators, QueueResult } from "./queueCalculator";

export interface SavedSimulation {
  id: string;
  name: string;
  timestamp: number;
  results: QueueResult[];
  indicators: QueueIndicators;
  intervalos: number[];
  duracoes: number[];
}

const STORAGE_KEY = "queue_simulations";

export function saveSimulation(
  name: string,
  results: QueueResult[],
  indicators: QueueIndicators,
  intervalos: number[],
  duracoes: number[]
): SavedSimulation {
  const simulation: SavedSimulation = {
    id: Date.now().toString(),
    name,
    timestamp: Date.now(),
    results,
    indicators,
    intervalos,
    duracoes,
  };

  const existing = getSavedSimulations();
  existing.push(simulation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return simulation;
}

export function getSavedSimulations(): SavedSimulation[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function deleteSimulation(id: string): void {
  const simulations = getSavedSimulations();
  const filtered = simulations.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllSimulations(): void {
  localStorage.removeItem(STORAGE_KEY);
}
