import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncResourceOptions = {
  autoLoad?: boolean;
};

export type AsyncResourceState<T> = {
  data: T;
  isLoading: boolean;
  isReloading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setData: (next: T) => void;
  setError: (next: string | null) => void;
};

export const useAsyncResource = <T,>(
  initialData: T,
  load: () => Promise<T>,
  toMessage: (e: unknown) => string,
  options?: AsyncResourceOptions,
): AsyncResourceState<T> => {
  const autoLoad = options?.autoLoad ?? true;

  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(autoLoad);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRef = useRef(load);
  const toMessageRef = useRef(toMessage);
  const requestIdRef = useRef(0);
  const hasLoadedOnceRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    toMessageRef.current = toMessage;
  }, [toMessage]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runLoad = useCallback(async (kind: "auto" | "reload") => {
    const requestId = ++requestIdRef.current;

    if (kind === "reload") {
      setIsLoading(true);
      setIsReloading(hasLoadedOnceRef.current);
      setError(null);
    } else {
      setError(null);
    }

    try {
      const next = await loadRef.current();
      if (!mountedRef.current) return;
      if (requestId !== requestIdRef.current) return;
      setData(next);
    } catch (e) {
      if (!mountedRef.current) return;
      if (requestId !== requestIdRef.current) return;
      setError(toMessageRef.current(e));
    } finally {
      if (!mountedRef.current) return;
      if (requestId !== requestIdRef.current) return;
      hasLoadedOnceRef.current = true;
      setIsLoading(false);
      setIsReloading(false);
    }
  }, []);

  const reload = useCallback(async () => {
    await runLoad("reload");
  }, [runLoad]);

  useEffect(() => {
    if (!autoLoad) return;
    void runLoad("auto");
  }, [autoLoad, runLoad]);

  return { data, isLoading, isReloading, error, reload, setData, setError };
};

