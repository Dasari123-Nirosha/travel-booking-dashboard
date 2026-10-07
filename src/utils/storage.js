export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Unable to save data:", error);
    return false;
  }
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return defaultValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error("Unable to read data:", error);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Unable to remove data:", error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Unable to clear storage:", error);
    return false;
  }
};