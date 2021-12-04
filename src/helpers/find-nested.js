// @ts-nocheck

export const findNested = (obj, key, value) => {
  if (obj[key] == value) {
    return obj;
  }

  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

    if (obj[k] && typeof obj[k] == 'object') {
      const found = findNested(obj[k], key, value);

      if (found) {
        return found;
      }
    }
  }
}