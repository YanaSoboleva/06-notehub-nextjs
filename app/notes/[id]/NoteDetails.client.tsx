'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.client.module.css';

export default function NoteDetailsClient() {
  
  const params = useParams();
  const id = params?.id as string;


  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id, 
  });

  
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  // 4. Відображення розмітки, якщо нотатку знайдено
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2 className={css.title}>{note.title}</h2>
        </div>
        
        <div className={css.contentBox}>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          
          {/* Виведення дати у зрозумілому форматі */}
          {note.createdAt && (
            <p className={css.date}>
              Created at: {new Date(note.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}