import { useEffect, useState } from "react";
import { toast } from "sonner";

type Page<T> = {
  content: T[];
  totalPages: number;
};

type FetchFunction<T> = (page: number, size: number) => Promise<Page<T>>;

export function usePaginatedData<T>(
  fetchFn: FetchFunction<T>,
  size: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn(page, size);
      if (!res || res.totalPages === undefined) {
        console.warn("⚠️ totalPages no está definido en la respuesta", res);
        setTotalPages(1);
      } else {
        setTotalPages(res.totalPages);
      }
      setData(res.content || []);
    } catch (e) {
      toast.error("Error al cargar los datos");
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  return {
    data,
    page,
    totalPages,
    loading,
    setPage,
    reload: load,
  };
}