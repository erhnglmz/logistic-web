import type { useCustomerForm } from '@/modules/customers/hooks/useCustomerForm';
import type { CustomerFormValues } from '@/modules/customers/validation/customer.schema';

interface CustomerFormProps {
  form: ReturnType<typeof useCustomerForm>;
  onSubmit: (values: CustomerFormValues) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function CustomerForm({
  form,
  onSubmit,
  submitLabel,
  isSubmitting,
  serverError,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const companyType = watch('companyType');
  const isIndividual = companyType === 'Individual';

  return (
    <form className="stack" onSubmit={handleSubmit(onSubmit)}>
      {serverError ? <div className="error-text">{serverError}</div> : null}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Firma Adı</label>
          <input id="name" {...register('name')} />
          {errors.name ? <span className="error-text">{errors.name.message}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="companyType">Firma Türü</label>
          <select id="companyType" {...register('companyType')}>
            <option value="Corporate">Kurumsal</option>
            <option value="Individual">Şahıs</option>
            <option value="SoleProprietor">Şahıs Şirketi</option>
          </select>
        </div>

        {!isIndividual ? (
          <>
            <div className="form-field">
              <label htmlFor="taxOffice">Vergi Dairesi</label>
              <input id="taxOffice" {...register('taxOffice')} />
              {errors.taxOffice ? <span className="error-text">{errors.taxOffice.message}</span> : null}
            </div>
            <div className="form-field">
              <label htmlFor="taxNumber">Vergi Numarası</label>
              <input id="taxNumber" {...register('taxNumber')} />
              {errors.taxNumber ? <span className="error-text">{errors.taxNumber.message}</span> : null}
            </div>
          </>
        ) : (
          <div className="form-field">
            <label htmlFor="nationalId">T.C. Kimlik No</label>
            <input id="nationalId" {...register('nationalId')} />
            {errors.nationalId ? <span className="error-text">{errors.nationalId.message}</span> : null}
          </div>
        )}

        <div className="form-field">
          <label htmlFor="phone">Telefon</label>
          <input id="phone" {...register('phone')} />
        </div>

        <div className="form-field">
          <label htmlFor="email">E-posta</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email ? <span className="error-text">{errors.email.message}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="defaultPaymentTermDays">Varsayılan Ödeme Vadesi (gün)</label>
          <input id="defaultPaymentTermDays" type="number" {...register('defaultPaymentTermDays')} />
        </div>

        <div className="form-field">
          <label htmlFor="defaultVatRate">Varsayılan KDV (%)</label>
          <input id="defaultVatRate" type="number" step="0.01" {...register('defaultVatRate')} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="address">Adres</label>
        <textarea id="address" {...register('address')} />
      </div>

      <div className="form-field">
        <label htmlFor="accountingContactInfo">Muhasebe İletişim Bilgileri</label>
        <textarea id="accountingContactInfo" {...register('accountingContactInfo')} />
      </div>

      <div className="row">
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
