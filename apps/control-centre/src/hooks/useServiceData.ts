import { useEffect, useState } from "react";

type AsyncState<TData> = {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
};

export function useServiceData<TData>(load: () => Promise<TData>): AsyncState<TData> {
  const [state, setState] = useState<AsyncState<TData>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let isCurrent = true;

    setState({ data: null, error: null, isLoading: true });

    void load()
      .then((data) => {
        if (isCurrent) {
          setState({ data, error: null, isLoading: false });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error("Unable to load dashboard data"),
            isLoading: false,
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [load]);

  return state;
}
