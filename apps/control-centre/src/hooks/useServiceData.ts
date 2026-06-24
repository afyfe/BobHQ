import { useCallback, useEffect, useState } from "react";

type AsyncState<TData> = {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
  isRefreshing: boolean;
  reload: () => void;
};

export function useServiceData<TData>(load: () => Promise<TData>): AsyncState<TData> {
  const [state, setState] = useState<AsyncState<TData>>({
    data: null,
    error: null,
    isLoading: true,
    isRefreshing: false,
    reload: () => undefined,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    setState((current) => ({
      ...current,
      error: null,
      isLoading: current.data === null,
      isRefreshing: current.data !== null,
    }));

    void load()
      .then((data) => {
        if (isCurrent) {
          setState({ data, error: null, isLoading: false, isRefreshing: false, reload });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState((current) => ({
            data: current.data,
            error: error instanceof Error ? error : new Error("Unable to load dashboard data"),
            isLoading: false,
            isRefreshing: false,
            reload,
          }));
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [load, reload, reloadToken]);

  return { ...state, reload };
}
