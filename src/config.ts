export interface Config {
  ACCOUNT_ETSY_WALLET: string;
  ACCOUNT_GNUCASH_RECEIVABLE: string;
  ACCOUNT_ETSY_ADS: string;
  ACCOUNT_ETSY_LISTING: string;
  ACCOUNT_ETSY_PROCESSING_FEES: string;
  ACCOUNT_ETSY_REGULATORY_FEES: string;
  ACCOUNT_ETSY_SALES: string;
  ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER: string;
  ACCOUNT_ETSY_SHIPPING_FEES: string;
  ACCOUNT_ETSY_TRANSACTION_FEES: string;
}

const throwError = (message: string) => {
  throw new Error(message);
};

type ParseConfig = (nodeProcess: typeof process) => Config;
export const parseConfig: ParseConfig = (process) => {
  const errorFn = (key: string) =>
    throwError(`Please set a value for "${key}" in .env file`);
  return {
    ACCOUNT_ETSY_WALLET:
      process.env['ACCOUNT_ETSY_WALLET'] || errorFn('ACCOUNT_ETSY_WALLET'),
    ACCOUNT_GNUCASH_RECEIVABLE:
      process.env['ACCOUNT_GNUCASH_RECEIVABLE'] ||
      errorFn('ACCOUNT_GNUCASH_RECEIVABLE'),
    ACCOUNT_ETSY_ADS:
      process.env['ACCOUNT_ETSY_ADS'] || errorFn('ACCOUNT_ETSY_ADS'),
    ACCOUNT_ETSY_LISTING:
      process.env['ACCOUNT_ETSY_LISTING'] || errorFn('ACCOUNT_ETSY_LISTING'),
    ACCOUNT_ETSY_PROCESSING_FEES:
      process.env['ACCOUNT_ETSY_PROCESSING_FEES'] ||
      errorFn('ACCOUNT_ETSY_PROCESSING_FEES'),
    ACCOUNT_ETSY_REGULATORY_FEES:
      process.env['ACCOUNT_ETSY_REGULATORY_FEES'] ||
      errorFn('ACCOUNT_ETSY_REGULATORY_FEES'),
    ACCOUNT_ETSY_SALES:
      process.env['ACCOUNT_ETSY_SALES'] || errorFn('ACCOUNT_ETSY_SALES'),
    ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER:
      process.env['ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER'] ||
      errorFn('ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER'),
    ACCOUNT_ETSY_SHIPPING_FEES:
      process.env['ACCOUNT_ETSY_SHIPPING_FEES'] ||
      errorFn('ACCOUNT_ETSY_SHIPPING_FEES'),
    ACCOUNT_ETSY_TRANSACTION_FEES:
      process.env['ACCOUNT_ETSY_TRANSACTION_FEES'] ||
      errorFn('ACCOUNT_ETSY_TRANSACTION_FEES'),
  };
};
