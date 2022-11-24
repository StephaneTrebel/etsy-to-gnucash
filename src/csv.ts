import { Config } from './config';

type ProcessCSV = (dependencies: {
  config: Config;
}) => (parameters: {
  csv: Array<Record<string, unknown>>;
}) => Array<Record<string, unknown>>;
export const processCSV: ProcessCSV =
  ({ config }) =>
  ({ csv }) =>
    csv.map((line) =>
      Object.fromEntries(
        Object.entries(line)
          .map(([key, value], index) => {
            // To account for localized headers, we'll only work on their relative position:
            // 0: Date
            // 1: Type
            // etc.
            const converters: Record<
              number | 'unknown',
              (key: string, value: unknown) => [string, unknown] | []
            > = {
              unknown: (key, value) => [key, value],
              // 0: Date
              0: (key, value) => [key, convertDate(value as string)],
              // 1: Type
              1: (key, value) => [key, value],
              // 2: Title
              2: (key, value) => [key, value],
              // 3: Info: ''
              3: (_key, _value) => [
                /* dropped */
              ],
              // 4: Devise: 'EUR',
              4: (_key, _value) => [
                /* dropped */
              ],
              // 5: Montant: '--',
              5: (_key, _value) => [
                /* dropped */
              ],
              // 6: 'Frais Et Taxes': '-€0.17',
              6: (_key, _value) => [
                /* dropped */
              ],
              // 7: Net: '-€0.17',
              7: (key, value) => [key, convertNet(value as string)],
              // 8: 'Informations Fiscales': '--',
              8: (_key, _value) => [
                /* dropped */
              ],
            };
            return (
              converters[index]?.(key, value) || converters.unknown(key, value)
            );
          })

          // Add new fields
          .concat([
            ['De', config.ACCOUNT_ETSY_BASE],
            ['Vers', getToAccount({ config })(line)],
          ])

          // Filter out dropped keys
          .filter((entry) => entry?.length > 0)
      )
    );

type ConvertDate = (dateLike: string) => string;
export const convertDate: ConvertDate = (dateLike) => {
  const date = new Date(dateLike);
  if (!date.toISOString()) {
    throw new Error('Invalid date');
  }
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
};

type ConvertNet = (input: string) => string;
export const convertNet: ConvertNet = (input) => {
  return `${input.replace('€', '')} €`;
};

type GetToAccount = (dependencies: {
  config: Config;
}) => (line: Record<string, unknown>) => string;
export const getToAccount: GetToAccount =
  ({ config }) =>
  (input) => {
    const destinationAccountFromTypes: Record<string | 'unknown', string> = {
      'TVA: Etsy Ads': config['ACCOUNT_ETSY_ADS'],
      'Crédit Etsy Ads': config['ACCOUNT_ETSY_ADS'],
      'Etsy Ads': config['ACCOUNT_ETSY_ADS'],

      'TVA: listing': config['ACCOUNT_ETSY_LISTING'],
      'Frais de mise en vente (0,20 USD)': config['ACCOUNT_ETSY_LISTING'],
      'TVA: auto-renew sold': config['ACCOUNT_ETSY_LISTING'],
      'TVA: renew sold': config['ACCOUNT_ETSY_LISTING'],

      'virés sur votre compte bancaire': config['ACCOUNT_GNUCASH_RECEIVABLE'],

      'TVA: shipping_transaction': config['ACCOUNT_ETSY_SHIPPING_FEES'],
      'Transaction fee: Shipping': config['ACCOUNT_ETSY_SHIPPING_FEES'],

      'Regulatory Operating fee': config['ACCOUNT_ETSY_REGULATORY_FEES'],
      'TVA: Regulatory Operating fee': config['ACCOUNT_ETSY_REGULATORY_FEES'],

      'Transaction fee (NOT SHIPPING)': config['ACCOUNT_ETSY_TRANSACTION_FEES'],
      'TVA: transaction': config['ACCOUNT_ETSY_TRANSACTION_FEES'],

      'Processing fee': config['ACCOUNT_ETSY_PROCESSING_FEES'],
      'VAT: Processing Fee': config['ACCOUNT_ETSY_PROCESSING_FEES'],

      'Payment for Order': config['ACCOUNT_ETSY_SALES'],

      'Sales tax paid by buyer': config['ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER'],
    };
    const lineType = (
      Object.values(input) as Record<number, string>
    )[2] as string;

    return (destinationAccountFromTypes[lineType] ||
      destinationAccountFromTypes['unknown']) as string;
  };
