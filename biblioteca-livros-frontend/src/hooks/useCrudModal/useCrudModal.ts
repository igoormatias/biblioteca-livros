import { useCallback, useEffect, useRef, useState } from "react";

export type CrudModalOptions<TItem> = {
  onOpenCreate?: () => void;
  onOpenEdit?: (item: TItem) => void;
  onClose?: () => void;
};

export type CrudModalState<TItem> = {
  isOpen: boolean;
  editingItem: TItem | null;
  openCreate: () => void;
  openEdit: (item: TItem) => void;
  close: () => void;
  setEditingItem: (item: TItem | null) => void;
};

export const useCrudModal = <TItem,>(opts?: CrudModalOptions<TItem>): CrudModalState<TItem> => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);

  const onOpenCreateRef = useRef(opts?.onOpenCreate);
  const onOpenEditRef = useRef(opts?.onOpenEdit);
  const onCloseRef = useRef(opts?.onClose);

  useEffect(() => {
    onOpenCreateRef.current = opts?.onOpenCreate;
    onOpenEditRef.current = opts?.onOpenEdit;
    onCloseRef.current = opts?.onClose;
  }, [opts?.onOpenCreate, opts?.onOpenEdit, opts?.onClose]);

  const openCreate = useCallback(() => {
    setEditingItem(null);
    onOpenCreateRef.current?.();
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((item: TItem) => {
    setEditingItem(item);
    onOpenEditRef.current?.(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    onCloseRef.current?.();
    setIsOpen(false);
    setEditingItem(null);
  }, []);

  return { isOpen, editingItem, openCreate, openEdit, close, setEditingItem };
};

