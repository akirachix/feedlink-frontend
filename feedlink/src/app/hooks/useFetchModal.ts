"use client";

import { useState, useCallback } from "react";

export default function useModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);

  return {
    modalOpen,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
  };
}