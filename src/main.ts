import { readFile, writeFile } from 'fs';
import { basename, join } from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

import { promisify } from 'util';
const readFilePromisifed = promisify(readFile);
const writeFilePromisifed = promisify(writeFile);

import { option } from 'argv';
import glob from 'glob';
const globPromisifed = promisify(glob);

import * as csvParse from 'csv-parse';
const parsePromisifed = promisify(
  csvParse.parse as (
    input: Buffer | string,
    callback?: csvParse.Callback
  ) => csvParse.Parser
);
import * as csvStringify from 'csv-stringify';
import { processCSV } from './csv';
import { parseConfig } from './config';
const stringifyPromisifed = promisify(
  csvStringify.stringify as (
    input: csvStringify.Input,
    callback?: csvStringify.Callback
  ) => csvStringify.Stringifier
);

type Main = (dependencies: {
  logger: typeof console;
  parse: typeof parsePromisifed;
  process: typeof process;
  stringify: typeof stringifyPromisifed;
  readFile: typeof readFilePromisifed;
  writeFile: typeof writeFilePromisifed;
}) => (params: {
  filenameList: Array<string>;
  outDir: string;
}) => Promise<void>;
export const main: Main =
  ({ logger, readFile, parse, stringify, writeFile }) =>
  ({ filenameList, outDir }) =>
    Promise.all(
      filenameList.map((filename) => {
        logger.log(`Begin fixing file ${filename}...`);
        return readFile(filename, { encoding: 'utf8' })
          .then(parse)
          .then(processCSV({ config: parseConfig(process) }))
          .then((convertedCSV) => stringify(convertedCSV))
          .then(async (serializedCSV) => {
            const outputFilename = join(
              outDir,
              `${basename(filename, '.csv')}_converted.csv`
            );
            await writeFile(outputFilename, serializedCSV);
            return outputFilename;
          })
          .then((outputFilename) =>
            logger.log(`File ${outputFilename} has been written.`)
          )
          .catch((error) =>
            logger.error(
              `FATAL: ${error.message} during handling of file ${filename}.`
            )
          );
      })
    ).then(() => logger.log(`Finished !`));

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
        parse: parsePromisifed,
        process,
        stringify: stringifyPromisifed,
        readFile: readFilePromisifed,
        writeFile: writeFilePromisifed,
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
