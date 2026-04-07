'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';

import css from './Notes.client.module.css';

export default function NotesClient() {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: notesResponse, isLoading, isError } = useQuery({
    queryKey: ['notes', filter],
    queryFn: () => fetchNotes({ search: filter }),
    placeholderData: (previousData) => previousData,
  });

  // Отримуємо масив з поля notes
  const notes = notesResponse?.notes || [];

  if (isError) return <p>Could not fetch the list of notes.</p>;

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>My Notes</h1>
        <button onClick={() => setIsModalOpen(true)}>Add New Note</button>
      </div>

      <SearchBox value={filter} onChange={(e: any) => setFilter(e.target.value)} />

      {isLoading && !notesResponse ? (
        <p>Loading, please wait...</p>
      ) : (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}