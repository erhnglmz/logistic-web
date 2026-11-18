export type CompanyType = 'Corporate' | 'Individual' | 'SoleProprietor';

export interface CustomerListItem {
  id: string;
  name: string;
  companyType: string;
  taxNumber?: string | null;
  nationalId?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdDate: string;
}

export interface CustomerContact {
  id: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  phone?: string | null;
  email?: string | null;
  isPrimary: boolean;
}

export interface CustomerNote {
  id: string;
  noteText: string;
  contactDate?: string | null;
  createdDate: string;
}

export interface CustomerBankAccount {
  id: string;
  iban: string;
  bankName?: string | null;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  companyType: string;
  taxOffice?: string | null;
  taxNumber?: string | null;
  nationalId?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  accountingContactInfo?: string | null;
  defaultPaymentTermDays?: number | null;
  defaultVatRate?: number | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string | null;
  roles: string[];
  contacts: CustomerContact[];
  notes: CustomerNote[];
  bankAccounts: CustomerBankAccount[];
}

export interface CustomerFormModel {
  name: string;
  companyType: CompanyType;
  taxOffice?: string;
  taxNumber?: string;
  nationalId?: string;
  address?: string;
  phone?: string;
  email?: string;
  accountingContactInfo?: string;
  defaultPaymentTermDays?: number;
  defaultVatRate?: number;
}

export interface CustomerListQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}
