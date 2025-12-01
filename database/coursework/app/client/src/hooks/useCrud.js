import { useState, useEffect, useCallback } from 'react';
import { fetchData, createItem, updateItem, deleteItem } from '../api';

export function useCrud(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (item) => {
    const newItem = await createItem(endpoint, item);
    await load();
    return newItem;
  };

  const update = async (id, item) => {
    const updated = await updateItem(endpoint, id, item);
    await load();
    return updated;
  };

  const remove = async (id) => {
    await deleteItem(endpoint, id);
    await load();
  };

  return { data, loading, error, load, create, update, remove };
}
