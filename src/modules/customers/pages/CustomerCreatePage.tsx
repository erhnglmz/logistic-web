import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerForm } from '@/modules/customers/components/CustomerForm';
import { useCustomerForm } from '@/modules/customers/hooks/useCustomerForm';
import type { CustomerFormValues } from '@/modules/customers/validation/customer.schema';
import { customerService } from '@/modules/customers/services/customerService';
import { HttpError } from '@/shared/services/httpClient';

export function CustomerCreatePage() {
  const navigate = useNavigate();
  const form = useCustomerForm();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) => customerService.createCustomer(values),
    onSuccess: (customer) => {
      navigate(`/customers/${customer.id}`);
    },
    onError: (error: Error) => {
      setServerError(error instanceof HttpError ? error.message : 'Müşteri oluşturulamadı.');
    },
  });

  return (
    <div className="page-container stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>Yeni Müşteri</h1>
          <p>Müşteri rolü ile yeni firma kartı oluşturun.</p>
        </div>
        <Link className="btn secondary" to="/customers">
          Listeye Dön
        </Link>
      </div>

      <section className="card">
        <CustomerForm
          form={form}
          submitLabel="Müşteri Oluştur"
          isSubmitting={mutation.isPending}
          serverError={serverError}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </section>
    </div>
  );
}
