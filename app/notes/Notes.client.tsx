"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Link from "next/link";
import styles from "../home.module.css";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при пошуку
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← На головну
        </Link>
        <h1 className={styles.title}>Мої нотатки</h1>
        <button
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Створити нотатку
        </button>
      </header>

      <div className={styles.searchContainer}>
        <SearchBox value={search} onChange={handleSearch} />
      </div>

      <NoteList
        notes={data?.notes || []}
        isLoading={isLoading}
        isError={isError}
      />

      {data && (
        <Pagination
          page={page}
          setPage={setPage}
          pageCount={data.totalPages}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
} 