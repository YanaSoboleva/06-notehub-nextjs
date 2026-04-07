'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api'; 
import { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Налаштування мутації для видалення нотатки
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (deletedNote) => {
      console.log(`Видалено нотатку: ${deletedNote.title}`);
      // Оновлюємо кеш, щоб список перерендерився без видаленої нотатки
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: any) => {
      console.error("Помилка при видаленні нотатки:", error);
      alert("Не вдалося видалити нотатку. Спробуйте ще раз.");
    }
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <div className={css.contentWrapper}>
            <h2 className={css.title}>{title}</h2>
            {/* Перевірте, чи в API поле називається content чи text */}
            <p className={css.content}>{content}</p>
          </div>
          
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            
            <div className={css.actions}>
              {/* Динамічне посилання на сторінку деталей */}
              <Link href={`/notes/${id}`} className={css.detailsLink}>
                View details
              </Link>

              <button 
                className={css.deleteBtn} 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this note?')) {
                    mutation.mutate(id);
                  }
                }}
                disabled={mutation.isPending}
                type="button"
              >
                {mutation.isPending ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}