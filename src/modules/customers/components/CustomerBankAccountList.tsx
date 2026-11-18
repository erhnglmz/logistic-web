import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CustomerBankAccount } from '@/modules/customers/models/customer.types';
import { customerService } from '@/modules/customers/services/customerService';
import { bankAccountFormSchema } from '@/modules/customers/validation/customer.schema';
import { HttpError } from '@/shared/services/httpClient';

interface CustomerBankAccountListProps {
  customerId: string;
  bankAccounts: CustomerBankAccount[];
  canEdit: boolean;
}

type BankAccountFormValues = {
  iban: string;
  bankName?: string;
  isDefault: boolean;
};

export function CustomerBankAccountList({
  customerId,
  bankAccounts,
  canEdit,
}: CustomerBankAccountListProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountFormSchema),
    defaultValues: { iban: '', bankName: '', isDefault: false },
  });

  const mutation = useMutation({
    mutationFn: (values: BankAccountFormValues) => customerService.addBankAccount(customerId, values),
    onSuccess: async () => {
      form.reset();
      setServerError(null);
      await queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
    onError: (error: Error) => {
      setServerError(error instanceof HttpError ? error.message : 'Banka hesabı eklenemedi.');
    },
  });

  return (
    <section className="card stack">
      <h3>Banka Hesapları</h3>
      {bankAccounts.length === 0 ? (
        <div className="empty-state">Henüz banka hesabı eklenmemiş.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>IBAN</th>
              <th>Banka</th>
              <th>Varsayılan</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.iban}</td>
                <td>{account.bankName ?? '-'}</td>
                <td>{account.isDefault ? 'Evet' : 'Hayır'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canEdit ? (
        <form className="stack" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          {serverError ? <div className="error-text">{serverError}</div> : null}
          <div className="form-grid">
            <div className="form-field">
              <label>IBAN</label>
              <input {...form.register('iban')} />
            </div>
            <div className="form-field">
              <label>Banka Adı</label>
              <input {...form.register('bankName')} />
            </div>
            <div className="form-field">
              <label>
                <input type="checkbox" {...form.register('isDefault')} /> Varsayılan hesap
              </label>
            </div>
          </div>
          <button className="btn secondary" type="submit" disabled={mutation.isPending}>
            Banka Hesabı Ekle
          </button>
        </form>
      ) : null}
    </section>
  );
}
