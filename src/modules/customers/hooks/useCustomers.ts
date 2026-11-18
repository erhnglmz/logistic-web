import { useQuery } from '@tanstack/react-query';
import type { CustomerListQuery } from '@/modules/customers/models/customer.types';
import { customerService } from '@/modules/customers/services/customerService';

export function useCustomers(query: CustomerListQuery) {
  return useQuery({
    queryKey: ['customers', query],
    queryFn: () => customerService.getCustomers(query),
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomerById(id!),
    enabled: Boolean(id),
  });
}
