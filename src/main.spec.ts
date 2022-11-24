import { main } from './main';

const mockDependencies = (dependencies?: Record<string, unknown>) =>
  ({
    logger: { log: () => {}, error: () => {} },
    parse: () => [],
    process: {
      env: {
        ACCOUNT_ETSY_WALLET: 'Purchases:Etsy',
        ACCOUNT_GNUCASH_RECEIVABLE: 'Assets:Bank Account',
        ACCOUNT_ETSY_ADS: 'Purchases:Etsy Ads',
        ACCOUNT_ETSY_LISTING: 'Purchases:Frais de mise en vente',
        ACCOUNT_ETSY_SHIPPING_FEES: 'Purchases:Shipping',
        ACCOUNT_ETSY_REGULATORY_FEES: 'Purchases:Regulatory Operating fee',
        ACCOUNT_ETSY_TRANSACTION_FEES: 'Purchases:Transaction fee',
        ACCOUNT_ETSY_PROCESSING_FEES: 'Purchases:Processing fee',
        ACCOUNT_ETSY_SALES: 'Income:Sales',
        ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER:
          'Purchases:Sales tax paid by buyer',
      },
    },
    stringify: () => '',
    readFile: () => Promise.resolve(''),
    writeFile: () => Promise.resolve(),
    ...dependencies,
  } as any);

describe('main()', () => {
  describe('When called with its dependencies and a file list', () => {
    it('Should return Void', () => {
      expect(
        main(mockDependencies())({ filenameList: [''], outDir: '' })
      ).resolves.toBeUndefined();
    });
  });
});
