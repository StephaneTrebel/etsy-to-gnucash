import { parseConfig } from './config';

describe('Config', () => {
  describe('parseConfig()', () => {
    describe('Given a Nodejs process environment that has lacks at least one variable', () => {
      const testProcess = {
        env: {
          ACCOUNT_ETSY_WALLET: 'ACCOUNT_ETSY_WALLET',
          ACCOUNT_GNUCASH_RECEIVABLE: 'ACCOUNT_GNUCASH_RECEIVABLE',
          ACCOUNT_ETSY_ADS: 'ACCOUNT_ETSY_ADS',
          ACCOUNT_ETSY_LISTING: 'ACCOUNT_ETSY_LISTING',
          ACCOUNT_ETSY_PROCESSING_FEES: 'ACCOUNT_ETSY_PROCESSING_FEES',
          ACCOUNT_ETSY_REGULATORY_FEES: 'ACCOUNT_ETSY_REGULATORY_FEES',
          ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER:
            'ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER',
          ACCOUNT_ETSY_SHIPPING_FEES: 'ACCOUNT_ETSY_SHIPPING_FEES',
          ACCOUNT_ETSY_TRANSACTION_FEES: 'ACCOUNT_ETSY_TRANSACTION_FEES',
        },
      } as unknown as NodeJS.Process;
      it('Should throw an error', () => {
        expect(() => parseConfig(testProcess)).toThrow();
      });
    });

    describe('Given a Nodejs process environment that has all needed variables', () => {
      const testProcess = {
        env: {
          ACCOUNT_ETSY_WALLET: 'ACCOUNT_ETSY_WALLET',
          ACCOUNT_GNUCASH_RECEIVABLE: 'ACCOUNT_GNUCASH_RECEIVABLE',
          ACCOUNT_ETSY_ADS: 'ACCOUNT_ETSY_ADS',
          ACCOUNT_ETSY_LISTING: 'ACCOUNT_ETSY_LISTING',
          ACCOUNT_ETSY_PROCESSING_FEES: 'ACCOUNT_ETSY_PROCESSING_FEES',
          ACCOUNT_ETSY_REGULATORY_FEES: 'ACCOUNT_ETSY_REGULATORY_FEES',
          ACCOUNT_ETSY_SALES: 'ACCOUNT_ETSY_SALES',
          ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER:
            'ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER',
          ACCOUNT_ETSY_SHIPPING_FEES: 'ACCOUNT_ETSY_SHIPPING_FEES',
          ACCOUNT_ETSY_TRANSACTION_FEES: 'ACCOUNT_ETSY_TRANSACTION_FEES',
        },
      } as unknown as NodeJS.Process;
      it('Should extract relevant environment variables for the config', () => {
        expect(parseConfig(testProcess)).toEqual({
          ACCOUNT_ETSY_WALLET: 'ACCOUNT_ETSY_WALLET',
          ACCOUNT_GNUCASH_RECEIVABLE: 'ACCOUNT_GNUCASH_RECEIVABLE',
          ACCOUNT_ETSY_ADS: 'ACCOUNT_ETSY_ADS',
          ACCOUNT_ETSY_LISTING: 'ACCOUNT_ETSY_LISTING',
          ACCOUNT_ETSY_PROCESSING_FEES: 'ACCOUNT_ETSY_PROCESSING_FEES',
          ACCOUNT_ETSY_REGULATORY_FEES: 'ACCOUNT_ETSY_REGULATORY_FEES',
          ACCOUNT_ETSY_SALES: 'ACCOUNT_ETSY_SALES',
          ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER:
            'ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER',
          ACCOUNT_ETSY_SHIPPING_FEES: 'ACCOUNT_ETSY_SHIPPING_FEES',
          ACCOUNT_ETSY_TRANSACTION_FEES: 'ACCOUNT_ETSY_TRANSACTION_FEES',
        });
      });
    });
  });
});
