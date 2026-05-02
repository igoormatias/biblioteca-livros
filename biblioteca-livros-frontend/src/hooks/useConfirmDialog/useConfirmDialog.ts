import { useCallback, useState } from "react";

export type ConfirmDialogState<TItem> = {
  pending: TItem | null;
  isConfirming: boolean;
  request: (item: TItem) => void;
  cancel: () => void;
  confirm: (run: (item: TItem) => Promise<void>) => Promise<void>;
  setPending: (item: TItem | null) => void;
};

export const useConfirmDialog = <TItem,>(): ConfirmDialogState<TItem> => {
  const [pending, setPending] = useState<TItem | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const request = useCallback((item: TItem) => {
    setPending(item);
  }, []);

  const cancel = useCallback(() => {
    setPending(null);
  }, []);

  const confirm = useCallback(
    async (run: (item: TItem) => Promise<void>) => {
      if (!pending) return;
      const item = pending;
      setIsConfirming(true);
      try {
        await run(item);
        setPending(null);
      } catch {
        return;
      } finally {
        setIsConfirming(false);
      }
    },
    [pending],
  );

  return { pending, isConfirming, request, cancel, confirm, setPending };
};

