import { Config } from './config';
import { convertDate, processCSV } from './csv';

const config: Config = {
  ACCOUNT_ETSY_WALLET: 'ACCOUNT_ETSY_WALLET',
  ACCOUNT_GNUCASH_RECEIVABLE: 'ACCOUNT_GNUCASH_RECEIVABLE',
  ACCOUNT_ETSY_ADS: 'ACCOUNT_ETSY_ADS',
  ACCOUNT_ETSY_LISTING: 'ACCOUNT_ETSY_LISTING',
  ACCOUNT_ETSY_PROCESSING_FEES: 'ACCOUNT_ETSY_PROCESSING_FEES',
  ACCOUNT_ETSY_REGULATORY_FEES: 'ACCOUNT_ETSY_REGULATORY_FEES',
  ACCOUNT_ETSY_SALES: 'ACCOUNT_ETSY_SALES',
  ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER: 'ACCOUNT_ETSY_SALES_TAX_PAID_BY_BUYER',
  ACCOUNT_ETSY_SHIPPING_FEES: 'ACCOUNT_ETSY_SHIPPING_FEES',
  ACCOUNT_ETSY_TRANSACTION_FEES: 'ACCOUNT_ETSY_TRANSACTION_FEES',
};

describe('CSV', () => {
  describe('convertDate()', () => {
    describe('Given a unparsable date', () => {
      it('Should throw an error', () => {
        expect(() => convertDate('toto')).toThrow();
      });
    });

    describe('Given a parsable date', () => {
      it('Should return the date in ISO format, padded when needed', () => {
        expect(convertDate('25 septembre 2022')).toEqual('25-09-2022');
        expect(convertDate('6 janvier 1981')).toEqual('06-01-1981');
      });
    });
  });

  describe('processCSV()', () => {
    describe('Given a csv content', () => {
      it('Should return converted content', () => {
        expect(
          processCSV({ config, logger: console })([
            {
              Date: '25 septembre 2022',
              Type: 'TVA',
              Titre: 'TVA: Etsy Ads',
              Info: '',
              Devise: 'EUR',
              Montant: '--',
              'Frais Et Taxes': '-€0.17',
              Net: '-€0.17',
              'Informations Fiscales': '--',
            },
          ])
        ).toEqual([
          {
            Date: '25-09-2022',
            Type: 'TVA',
            De: 'ACCOUNT_ETSY_WALLET',
            Vers: 'ACCOUNT_ETSY_ADS',
            Titre: 'TVA: Etsy Ads',
            Net: '-0.17 €',
          },
        ]);
      });
    });
  });
});
