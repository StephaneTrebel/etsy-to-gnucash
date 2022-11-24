import { readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';
import { promisify } from 'util';

import { option } from 'argv';
import * as dotenv from 'dotenv';
dotenv.config();
import glob from 'glob';
const globPromisifed = promisify(glob);

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

import { processCSV } from './csv';
import { parseConfig } from './config';

type Main = (dependencies: {
  logger: typeof console;
  parse: typeof parse;
  process: typeof process;
  stringify: typeof stringify;
  readFile: typeof readFile;
  writeFile: typeof writeFile;
}) => (params: {
  filenameList: Array<string>;
  outDir: string;
}) => Promise<void>;
export const main: Main = ({
  logger,
  readFile,
  parse,
  process,
  stringify,
  writeFile,
}) => {
  logger.log(`[CONFIG] Parsing environment variables for config`);
  const config = parseConfig(process);
  return ({ filenameList, outDir }) =>
    Promise.all(
      filenameList.map((filename) => {
        const file = basename(filename);
        const log = function (message: string): false {
          logger.log(`[${file}] ${message}`);
          return false;
        };
        log(`Begin fixing file`);
        return readFile(filename, { encoding: 'utf8' })
          .then((x) => {
            return parse(x, {
              columns: true,
              skip_empty_lines: true,
            });
          })
          .then((x) => log(`Processing CSV`) || x)
          .then(processCSV({ config, logger }))
          .then((x) => log(`Stringify CSV`) || x)
          .then((convertedCSV) => stringify(convertedCSV))
          .then((x) => log(`Writing output file`) || x)
          .then(async (serializedCSV) => {
            const outputfile = join(
              outDir,
              `${basename(file, '.csv')}_converted.csv`
            );
            await writeFile(outputfile, serializedCSV);
            log(`File ${outputfile} has been written.`);
            return outputfile;
          })
          .catch((error) => {
            logger.error(
              `FATAL: ${error.message} during handling of file '${file}'`
            );
            logger.log(error.stack);
          });
      })
    ).then(() => logger.log(`Finished !`));
};

if (process.env['NODE_ENV'] !== 'test') {
  // Argv setup
  const args = option([
    {
      name: 'inputDir',
      short: 'i',
      type: 'path',
      description:
        'Defines input folder for source CSV filenameList. Default to current directory',
      example: "'etsy-to-gnucash --inputDir=.' or 'etsy-to-gnucash -i=myDir'",
    },
    {
      name: 'outDir',
      short: 'o',
      type: 'path',
      description:
        'Defines target folder for fixed CSV filenameList. Default to current directory',
      example: "'etsy-to-gnucash --outDir=/tmp' or 'etsy-to-gnucash -o=.'",
    },
    {
      name: 'help',
      short: 'h',
      type: 'string',
      description: 'Show help and usage info.',
      example: "'etsy-to-gnucash --help'",
    },
  ]).run();

  if (args.options['h'] || args.options['help']) {
    console.log(`etsy-to-gnucash, a tool to prepare Etsy finance export CSV files for import in GNUCash
usage: etsy-to-gnucash --inputDir=<input_directory> --outDir=<output_directory>

Will convert all files in <input_directory> and write a converted version in <output_directory>.`);

    process.exit(0);
  }

  if (!args.options['inputDir']) {
    console.error(`--inputDir/-i is mandatory`);
    process.exit(1);
  }

  if (!args.options['outDir']) {
    console.error(`--outDir/-o is mandatory`);
    process.exit(1);
  }

  globPromisifed(`${args.options['inputDir']}/*.csv`)
    .then((filenameList) =>
      // Main execution
      main({
        logger: console,
        parse,
        process,
        readFile,
        stringify,
        writeFile,
      })({
        filenameList,
        outDir: args.options['outDir'],
      })
    )
    .then(() => console.log('Job complete'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
