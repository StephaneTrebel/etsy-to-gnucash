import { Config } from './config';
import {
  convertAdvertisementLine,
  convertDate,
  getAmount,
  processCSV,
} from './csv';

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
    describe('Given an unparsable date', () => {
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

  describe('getAmount()', () => {
    describe('Given an amount located in Net column', () => {
      it('Should return the expected amount', () => {
        expect(
          getAmount({
            Date: '25 septembre 2022',
            Type: 'TVA',
            Titre: 'TVA: Etsy Ads',
            Info: '',
            Devise: 'EUR',
            Montant: '--',
            'Frais Et Taxes': '-€0.17',
            Net: '-€0.17',
            'Informations Fiscales': '--',
          })
        ).toEqual('0.17 €');
      });
    });

    describe('Given an amount located in Titre column', () => {
      it('Should return the expected amount', () => {
        expect(
          getAmount({
            Date: '25 septembre 2022',
            Type: 'TVA',
            Titre: '€53.36 virés sur votre compte bancaire',
            Info: '',
            Devise: 'EUR',
            Montant: '--',
            'Frais Et Taxes': '--',
            Net: '--',
            'Informations Fiscales': '--',
          })
        ).toEqual('53.36 €');
      });
    });
  });

  describe('convertAdvertisementLine()', () => {
    describe('Given an advertisement line', () => {
      it('Should return the converted equivalent line', () => {
        expect(
          convertAdvertisementLine(config)({
            line: {
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
            transactionId: 123,
          })
        ).toEqual([
          {
            TransactionId: 123,
            Date: '25-09-2022',
            Type: 'TVA',
            Compte: 'ACCOUNT_ETSY_ADS',
            Titre: 'TVA: Etsy Ads',
            Credit: '0.17 €',
            Debit: '',
          },
          {
            TransactionId: 123,
            Date: '25-09-2022',
            Type: 'TVA',
            Compte: 'ACCOUNT_ETSY_WALLET',
            Titre: 'TVA: Etsy Ads',
            Credit: '',
            Debit: '0.17 €',
          },
        ]);
      });
    });
  });

  describe('processCSV()', () => {
    describe('Given a CSV line object equivalent', () => {
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
            TransactionId: 1,
            Date: '25-09-2022',
            Type: 'TVA',
            Compte: 'ACCOUNT_ETSY_ADS',
            Titre: 'TVA: Etsy Ads',
            Credit: '0.17 €',
            Debit: '',
          },
          {
            TransactionId: 1,
            Date: '25-09-2022',
            Type: 'TVA',
            Compte: 'ACCOUNT_ETSY_WALLET',
            Titre: 'TVA: Etsy Ads',
            Credit: '',
            Debit: '0.17 €',
          },
        ]);
      });
    });
  });
});
