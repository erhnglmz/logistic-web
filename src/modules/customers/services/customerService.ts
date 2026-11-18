import type {
  Customer,
  CustomerListQuery,
  CustomerListItem,
  CustomerContact,
  CustomerNote,
  CustomerBankAccount,
} from '@/modules/customers/models/customer.types';
import type { CustomerFormValues } from '@/modules/customers/validation/customer.schema';
import { httpClient } from '@/shared/services/httpClient';
import type { PagedResponse } from '@/shared/types/api.types';

function toRequestPayload(model: CustomerFormValues) {
  return {
    name: model.name,
    companyType: model.companyType,
    taxOffice: model.taxOffice || null,
    taxNumber: model.taxNumber || null,
    nationalId: model.nationalId || null,
    address: model.address || null,
    phone: model.phone || null,
    email: model.email || null,
    accountingContactInfo: model.accountingContactInfo || null,
    defaultPaymentTermDays: model.defaultPaymentTermDays ?? null,
    defaultVatRate: model.defaultVatRate ?? null,
  };
}

function buildQueryString(query: CustomerListQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.isActive !== undefined) params.set('isActive', String(query.isActive));
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortDescending) params.set('sortDescending', 'true');
  const value = params.toString();
  return value ? `?${value}` : '';
}

export const customerService = {
  getCustomers(query: CustomerListQuery) {
    return httpClient<PagedResponse<CustomerListItem>>(`/api/customers${buildQueryString(query)}`);
  },

  getCustomerById(id: string) {
    return httpClient<Customer>(`/api/customers/${id}`);
  },

  createCustomer(model: CustomerFormValues) {
    return httpClient<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(toRequestPayload(model)),
    });
  },

  updateCustomer(id: string, model: CustomerFormValues) {
    return httpClient<Customer>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toRequestPayload(model)),
    });
  },

  deactivateCustomer(id: string) {
    return httpClient<void>(`/api/customers/${id}/deactivate`, { method: 'PATCH' });
  },

  addContact(id: string, payload: Omit<CustomerContact, 'id'>) {
    return httpClient<CustomerContact>(`/api/customers/${id}/contacts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addNote(id: string, payload: { noteText: string; contactDate?: string | null }) {
    return httpClient<CustomerNote>(`/api/customers/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addBankAccount(id: string, payload: Omit<CustomerBankAccount, 'id'>) {
    return httpClient<CustomerBankAccount>(`/api/customers/${id}/bank-accounts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
