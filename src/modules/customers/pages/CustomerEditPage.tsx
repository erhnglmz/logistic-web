import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerForm } from '@/modules/customers/components/CustomerForm';
import { useCustomerForm } from '@/modules/customers/hooks/useCustomerForm';
import { useCustomer } from '@/modules/customers/hooks/useCustomers';
import type { CompanyType } from '@/modules/customers/models/customer.types';
import type { CustomerFormValues } from '@/modules/customers/validation/customer.schema';
import { customerService } from '@/modules/customers/services/customerService';
import { HttpError } from '@/shared/services/httpClient';

export function CustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useCustomer(id);
  const form = useCustomerForm();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    form.reset({
      name: data.name,
      companyType: data.companyType as CompanyType,
      taxOffice: data.taxOffice ?? '',
      taxNumber: data.taxNumber ?? '',
      nationalId: data.nationalId ?? '',
      address: data.address ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      accountingContactInfo: data.accountingContactInfo ?? '',
      defaultPaymentTermDays: data.defaultPaymentTermDays ?? undefined,
      defaultVatRate: data.defaultVatRate ?? undefined,
    });
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) => customerService.updateCustomer(id!, values),
    onSuccess: (customer) => {
      navigate(`/customers/${customer.id}`);
    },
    onError: (mutationError: Error) => {
      setServerError(
        mutationError instanceof HttpError ? mutationError.message : 'Müşteri güncellenemedi.',
      );
    },
  });

  if (isLoading) {
    return <div className="page-container loading-state">Müşteri yükleniyor...</div>;
  }

  if (isError || !data) {
    return (
      <div className="page-container error-text">
        {error instanceof Error ? error.message : 'Müşteri bulunamadı.'}
      </div>
    );
  }

  return (
    <div className="page-container stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>Müşteri Düzenle</h1>
          <p>{data.name}</p>
        </div>
        <Link className="btn secondary" to={`/customers/${data.id}`}>
          Detaya Dön
        </Link>
      </div>

      <section className="card">
        <CustomerForm
          form={form}
          submitLabel="Değişiklikleri Kaydet"
          isSubmitting={mutation.isPending}
          serverError={serverError}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </section>
    </div>
  );
}
