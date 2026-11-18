import { z } from 'zod';

function optionalNumber() {
  return z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().optional());
}

export const customerFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Firma adı zorunludur.'),
    companyType: z.enum(['Corporate', 'Individual', 'SoleProprietor']),
    taxOffice: z.string().trim().optional(),
    taxNumber: z.string().trim().optional(),
    nationalId: z.string().trim().optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().email('Geçerli bir e-posta girin.').optional().or(z.literal('')),
    accountingContactInfo: z.string().trim().optional(),
    defaultPaymentTermDays: optionalNumber(),
    defaultVatRate: optionalNumber(),
  })
  .superRefine((value, context) => {
    if (value.companyType === 'Individual') {
      if (!value.nationalId) {
        context.addIssue({
          code: 'custom',
          message: 'Şahıs firmalar için T.C. kimlik numarası zorunludur.',
          path: ['nationalId'],
        });
      }
    } else {
      if (!value.taxNumber) {
        context.addIssue({
          code: 'custom',
          message: 'Kurumsal firmalar için vergi numarası zorunludur.',
          path: ['taxNumber'],
        });
      }
      if (!value.taxOffice) {
        context.addIssue({
          code: 'custom',
          message: 'Kurumsal firmalar için vergi dairesi zorunludur.',
          path: ['taxOffice'],
        });
      }
    }
  });

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Ad zorunludur.'),
  lastName: z.string().trim().min(1, 'Soyad zorunludur.'),
  title: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Geçerli bir e-posta girin.').optional().or(z.literal('')),
  isPrimary: z.boolean(),
});

export const noteFormSchema = z.object({
  noteText: z.string().trim().min(1, 'Not metni zorunludur.'),
  contactDate: z.string().optional(),
});

export const bankAccountFormSchema = z.object({
  iban: z.string().trim().min(1, 'IBAN zorunludur.'),
  bankName: z.string().trim().optional(),
  isDefault: z.boolean(),
});
