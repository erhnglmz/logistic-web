import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '@/modules/customers/hooks/useCustomers';

export function CustomerListPage() {
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(true);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useCustomers({
    search,
    isActive,
    page,
    pageSize: 20,
    sortBy: 'name',
  });

  return (
    <div className="page-container stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>Müşteriler</h1>
          <p>Firma kartları ve müşteri rolündeki kayıtlar.</p>
        </div>
        <Link className="btn" to="/customers/new">
          Yeni Müşteri
        </Link>
      </div>

      <section className="card row">
        <input
          placeholder="Ad, vergi no veya T.C. kimlik no ile ara"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          style={{ flex: 1, minWidth: 240 }}
        />
        <select
          value={isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'}
          onChange={(event) => {
            const value = event.target.value;
            setIsActive(value === 'all' ? undefined : value === 'active');
            setPage(1);
          }}
        >
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="all">Tümü</option>
        </select>
      </section>

      <section className="card">
        {isLoading ? <div className="loading-state">Müşteriler yükleniyor...</div> : null}
        {isError ? (
          <div className="error-text">{error instanceof Error ? error.message : 'Liste alınamadı.'}</div>
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <div className="empty-state">Kayıt bulunamadı.</div>
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Firma Adı</th>
                  <th>Tür</th>
                  <th>Vergi / T.C.</th>
                  <th>Telefon</th>
                  <th>Durum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.items.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.companyType}</td>
                    <td>{customer.taxNumber ?? customer.nationalId ?? '-'}</td>
                    <td>{customer.phone ?? '-'}</td>
                    <td>
                      <span className={`status-badge ${customer.isActive ? 'active' : 'inactive'}`}>
                        {customer.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/customers/${customer.id}`}>Detay</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row" style={{ justifyContent: 'space-between', marginTop: 16 }}>
              <span>
                Toplam {data.total} kayıt · Sayfa {data.page}
              </span>
              <div className="row">
                <button
                  className="btn secondary"
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Önceki
                </button>
                <button
                  className="btn secondary"
                  type="button"
                  disabled={page * data.pageSize >= data.total}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Sonraki
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
