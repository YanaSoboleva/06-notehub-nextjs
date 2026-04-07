'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { NoteList } from '@/components/NoteList/NoteList';
import  SearchBox  from '@/components/SearchBox/SearchBox';
import  Pagination  from '@/components/Pagination/Pagination';
import  Modal  from '@/components/Modal/Modal';
import  NoteForm  from '@/components/NoteForm/NoteForm';
import css from './NotesClient/Notes.client.module.css';

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const perPage = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: () => fetchNotes({ 
      page: currentPage, 
      perPage, 
      search: debouncedSearch 
    }),
    placeholderData: keepPreviousData, 
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className={css.container}>
      <div className={css.controls}>
        <SearchBox onChange={handleSearchChange} />
        
        <button 
          className={css.addBtn} 
          onClick={() => setIsModalOpen(true)}
        >
          Add New Note
        </button>
      </div>

      {isLoading && <div className={css.status}>Loading notes...</div>}
      
      {isError && (
        <div className={css.error}>Error loading notes. Please try again.</div>
      )}

      {data && (
        <>
          <NoteList notes={data.notes} />
          
          {data && data.totalPages > 1 && (
          <Pagination
           pageCount={data.totalPages} // Було total, має бути pageCount
           onPageChange={(selected) => handlePageChange(selected + 1)} // Бібліотека react-paginate використовує 0-базовий індекс
           forcePage={currentPage - 1} // Синхронізація поточної сторінки
         />
         )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
}