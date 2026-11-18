import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <header style={{ background: '#111827', color: '#fff', padding: '16px 24px' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>Logistic Automation</strong>
          <nav className="row">
            <NavLink to="/customers" style={{ color: '#fff' }}>
              Müşteriler
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
