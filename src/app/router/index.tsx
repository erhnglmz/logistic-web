import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { CustomerCreatePage } from '@/modules/customers/pages/CustomerCreatePage';
import { CustomerDetailPage } from '@/modules/customers/pages/CustomerDetailPage';
import { CustomerEditPage } from '@/modules/customers/pages/CustomerEditPage';
import { CustomerListPage } from '@/modules/customers/pages/CustomerListPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerCreatePage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
