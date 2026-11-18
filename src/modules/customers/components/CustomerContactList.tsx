import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CustomerContact } from '@/modules/customers/models/customer.types';
import { customerService } from '@/modules/customers/services/customerService';
import { contactFormSchema } from '@/modules/customers/validation/customer.schema';
import { HttpError } from '@/shared/services/httpClient';

interface CustomerContactListProps {
  customerId: string;
  contacts: CustomerContact[];
  canEdit: boolean;
}

type ContactFormValues = {
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
};

export function CustomerContactList({ customerId, contacts, canEdit }: CustomerContactListProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      phone: '',
      email: '',
      isPrimary: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) => customerService.addContact(customerId, values),
    onSuccess: async () => {
      form.reset();
      setServerError(null);
      await queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
    onError: (error: Error) => {
      setServerError(error instanceof HttpError ? error.message : 'Yetkili kişi eklenemedi.');
    },
  });

  return (
    <section className="card stack">
      <h3>Yetkili Kişiler</h3>
      {contacts.length === 0 ? (
        <div className="empty-state">Henüz yetkili kişi eklenmemiş.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Ünvan</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>Birincil</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  {contact.firstName} {contact.lastName}
                </td>
                <td>{contact.title ?? '-'}</td>
                <td>{contact.phone ?? '-'}</td>
                <td>{contact.email ?? '-'}</td>
                <td>{contact.isPrimary ? 'Evet' : 'Hayır'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canEdit ? (
        <form
          className="stack"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {serverError ? <div className="error-text">{serverError}</div> : null}
          <div className="form-grid">
            <div className="form-field">
              <label>Ad</label>
              <input {...form.register('firstName')} />
            </div>
            <div className="form-field">
              <label>Soyad</label>
              <input {...form.register('lastName')} />
            </div>
            <div className="form-field">
              <label>Ünvan</label>
              <input {...form.register('title')} />
            </div>
            <div className="form-field">
              <label>Telefon</label>
              <input {...form.register('phone')} />
            </div>
            <div className="form-field">
              <label>E-posta</label>
              <input {...form.register('email')} />
            </div>
            <div className="form-field">
              <label>
                <input type="checkbox" {...form.register('isPrimary')} /> Birincil yetkili
              </label>
            </div>
          </div>
          <button className="btn secondary" type="submit" disabled={mutation.isPending}>
            Yetkili Kişi Ekle
          </button>
        </form>
      ) : null}
    </section>
  );
}
