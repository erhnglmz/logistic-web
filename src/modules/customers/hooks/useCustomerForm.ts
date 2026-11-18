import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import {
  customerFormSchema,
  type CustomerFormValues,
} from '@/modules/customers/validation/customer.schema';

const defaultValues: CustomerFormValues = {
  name: '',
  companyType: 'Corporate',
  taxOffice: '',
  taxNumber: '',
  nationalId: '',
  address: '',
  phone: '',
  email: '',
  accountingContactInfo: '',
};

export function useCustomerForm(initialValues?: Partial<CustomerFormValues>) {
  return useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema) as Resolver<CustomerFormValues>,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });
}
