import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerBankAccountList } from '@/modules/customers/components/CustomerBankAccountList';
import { CustomerContactList } from '@/modules/customers/components/CustomerContactList';
import { CustomerNoteList } from '@/modules/customers/components/CustomerNoteList';
import { useCustomer } from '@/modules/customers/hooks/useCustomers';
import { customerService } from '@/modules/customers/services/customerService';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useCustomer(id);

  const deactivateMutation = useMutation({
    mutationFn: () => customerService.deactivateCustomer(id!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customer', id] });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
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
          <h1>{data.name}</h1>
          <div className="row">
            <span className={`status-badge ${data.isActive ? 'active' : 'inactive'}`}>
              {data.isActive ? 'Aktif' : 'Pasif'}
            </span>
            <span>{data.companyType}</span>
          </div>
        </div>
        <div className="row">
          <Link className="btn secondary" to="/customers">
            Listeye Dön
          </Link>
          {data.isActive ? (
            <>
              <Link className="btn" to={`/customers/${data.id}/edit`}>
                Düzenle
              </Link>
              <button
                className="btn danger"
                type="button"
                disabled={deactivateMutation.isPending}
                onClick={async () => {
                  await deactivateMutation.mutateAsync();
                  navigate('/customers');
                }}
              >
                Pasife Al
              </button>
            </>
          ) : null}
        </div>
      </div>

      <section className="card">
        <div className="form-grid">
          <div>
            <strong>Vergi Dairesi</strong>
            <div>{data.taxOffice ?? '-'}</div>
          </div>
          <div>
            <strong>Vergi No</strong>
            <div>{data.taxNumber ?? '-'}</div>
          </div>
          <div>
            <strong>T.C. Kimlik No</strong>
            <div>{data.nationalId ?? '-'}</div>
          </div>
          <div>
            <strong>Telefon</strong>
            <div>{data.phone ?? '-'}</div>
          </div>
          <div>
            <strong>E-posta</strong>
            <div>{data.email ?? '-'}</div>
          </div>
          <div>
            <strong>Ödeme Vadesi</strong>
            <div>{data.defaultPaymentTermDays ?? '-'} gün</div>
          </div>
          <div>
            <strong>Varsayılan KDV</strong>
            <div>{data.defaultVatRate ?? '-'}%</div>
          </div>
          <div>
            <strong>Roller</strong>
            <div>{data.roles.join(', ')}</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <strong>Adres</strong>
          <div>{data.address ?? '-'}</div>
        </div>
        <div style={{ marginTop: 16 }}>
          <strong>Muhasebe İletişim</strong>
          <div>{data.accountingContactInfo ?? '-'}</div>
        </div>
      </section>

      <CustomerContactList
        customerId={data.id}
        contacts={data.contacts}
        canEdit={data.isActive}
      />
      <CustomerNoteList customerId={data.id} notes={data.notes} canEdit={data.isActive} />
      <CustomerBankAccountList
        customerId={data.id}
        bankAccounts={data.bankAccounts}
        canEdit={data.isActive}
      />
    </div>
  );
}
