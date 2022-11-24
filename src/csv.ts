import { Config } from './config';

export interface EtsyCSVLine {
  Date: string;
  Type: string;
  Titre: string;
  Info: string;
  Devise: string;
  Montant: string;
  'Frais Et Taxes': string;
  Net: string;
  'Informations Fiscales': string;
}

export interface ConvertedCSVLine {
  TransactionId: number;
  Date: string;
  Type: string;
  Compte: string;
  Titre: string;
  Credit: string;
  Debit: string;
}

type ConvertDate = (dateLike: string) => string;
export const convertDate: ConvertDate = (dateLike) => {
  const date = new Date(dateLike);
  try {
    // Trigger date check
    !date.toISOString();
    return `${date.getDate().toString().padStart(2, '0')}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  } catch (error) {
    throw new Error(`Invalid date: '${JSON.stringify(date)}'`);
  }
};

type GetAmount = (line: EtsyCSVLine) => string;
export const getAmount: GetAmount = (line) => {
  let input: string;
  const values = Object.values(line);
  const results = values[2].match(/(.*) virés sur votre compte bancaire/);
  if (results?.length) {
    input = results[1]; // Titre
  } else {
    input = values[7]; // Net
  }
  return `${input.replace(/[€-]*/, '')} €`;
};

type ProcessCSV = (dependencies: {
  logger: typeof console;
  config: Config;
}) => (csv: Array<EtsyCSVLine>) => Array<ConvertedCSVLine>;
export const processCSV: ProcessCSV =
  ({ config }) =>
  (csv) =>
    csv
      .map((line, index) =>
        convertAdvertisementLine(config)({
          line,
          // Avoids 0-based transaction ids
          // (not sure GNUCash would like them)
          transactionId: index + 1,
        })
      )
      .flat();

type ConvertAdvertisementLine = (
  config: Config
) => (params: {
  line: EtsyCSVLine;
  transactionId: number;
}) => [ConvertedCSVLine, ConvertedCSVLine];
export const convertAdvertisementLine: ConvertAdvertisementLine =
  (config) =>
  ({ line, transactionId }) => {
    const amount = getAmount(line);
    const date = convertDate(line.Date);
    return [
      {
        TransactionId: transactionId,
        Date: date,
        Type: line.Type,
        Compte: config['ACCOUNT_ETSY_ADS'],
        Titre: line.Titre,
        Credit: amount,
        Debit: '',
      },
      {
        TransactionId: transactionId,
        Date: date,
        Type: line.Type,
        Compte: config['ACCOUNT_ETSY_WALLET'],
        Titre: line.Titre,
        Credit: '',
        Debit: amount,
      },
    ];
  };
