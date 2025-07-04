// utils/storage.ts
export const getParsedItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined") return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
};
