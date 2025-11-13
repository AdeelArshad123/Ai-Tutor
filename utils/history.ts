import { ApiGenerationHistoryItem } from '../types';

const API_HISTORY_KEY = 'api_generation_history';

export const getApiGenerationHistory = (): ApiGenerationHistoryItem[] => {
  try {
    const history = localStorage.getItem(API_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Failed to parse API generation history from localStorage", error);
    return [];
  }
};

export const saveApiGenerationHistory = (item: ApiGenerationHistoryItem) => {
  try {
    const history = getApiGenerationHistory();
    // Add new item to the front, and limit history size to prevent localStorage bloat
    const newHistory = [item, ...history].slice(0, 20); // Limit to 20 most recent
    localStorage.setItem(API_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save API generation history to localStorage", error);
  }
};

export const clearApiGenerationHistory = () => {
    try {
        localStorage.removeItem(API_HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear API generation history from localStorage", error);
    }
}