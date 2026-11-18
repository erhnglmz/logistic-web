import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CustomerNote } from '@/modules/customers/models/customer.types';
import { customerService } from '@/modules/customers/services/customerService';
import { noteFormSchema } from '@/modules/customers/validation/customer.schema';
import { HttpError } from '@/shared/services/httpClient';

interface CustomerNoteListProps {
  customerId: string;
  notes: CustomerNote[];
  canEdit: boolean;
}

type NoteFormValues = {
  noteText: string;
  contactDate?: string;
};

export function CustomerNoteList({ customerId, notes, canEdit }: CustomerNoteListProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { noteText: '', contactDate: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: NoteFormValues) =>
      customerService.addNote(customerId, {
        noteText: values.noteText,
        contactDate: values.contactDate || null,
      }),
    onSuccess: async () => {
      form.reset();
      setServerError(null);
      await queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
    onError: (error: Error) => {
      setServerError(error instanceof HttpError ? error.message : 'Not eklenemedi.');
    },
  });

  return (
    <section className="card stack">
      <h3>Görüşme Notları</h3>
      {notes.length === 0 ? (
        <div className="empty-state">Henüz görüşme notu eklenmemiş.</div>
      ) : (
        <div className="stack">
          {notes.map((note) => (
            <div key={note.id} className="card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{new Date(note.createdDate).toLocaleString('tr-TR')}</strong>
                {note.contactDate ? <span>Görüşme: {note.contactDate}</span> : null}
              </div>
              <p>{note.noteText}</p>
            </div>
          ))}
        </div>
      )}

      {canEdit ? (
        <form className="stack" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          {serverError ? <div className="error-text">{serverError}</div> : null}
          <div className="form-field">
            <label>Not</label>
            <textarea {...form.register('noteText')} />
          </div>
          <div className="form-field">
            <label>Görüşme Tarihi</label>
            <input type="date" {...form.register('contactDate')} />
          </div>
          <button className="btn secondary" type="submit" disabled={mutation.isPending}>
            Not Ekle
          </button>
        </form>
      ) : null}
    </section>
  );
}
