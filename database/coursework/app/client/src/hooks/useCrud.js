import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchData, createItem, updateItem, deleteItem } from '../api';

export function useCrud(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = useCallback(async (customFilters) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = customFilters || filtersRef.current;
      const queryString = Object.entries(activeFilters)
        .filter(([, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const result = await fetchData(url);
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

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    load(newFilters);
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

  return { data, loading, error, load, create, update, remove, filters, applyFilters };
}
