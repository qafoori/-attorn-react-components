// @ts-nocheck

export const findNested = (obj, key, value) => {
  if (obj[key] === value) {
    return obj;
  }

  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

    if (obj[k] && typeof obj[k] === 'object') {
      const found = findNested(obj[k], key, value);

      if (found) {
        return found;
      }
    }
  }
}


export function traverse(o, fn) {
  for (const k in o) {
    const res = fn.apply(this, [o, k]);
    if (res) {
      return res;
    }
    if (o[k] !== null && typeof o[k] == 'object') {
      const res = traverse(o[k], fn);
      if (res) return res;
    }
  }
}

// create custom 'visitors' to retrieve source and target arrays
export const splice_source = (obj, predicate) =>
  traverse(
    obj,
    // 'visitor' callback
    (o, k) => {
      let m_index = -1;
      if (Array.isArray(o[k])) {
        m_index = o[k].findIndex((o) => predicate(o, k));
      }

      return m_index !== -1 ? o[k].splice(m_index, 1)[0] : false;
    });


export const find_target_array = (obj, predicate) =>
  traverse(
    obj,
    // 'visitor' callback
    (o, k) => (predicate(o, k) ? o.subData : false)
  );
