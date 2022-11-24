import { readFileSync } from 'fs';

import { parse } from 'csv-parse/sync';

type ParseFile = (dependencies: {
  readFileSync: typeof readFileSync;
  parse: typeof parse;
}) => (filename: string) => Record<string, unknown>;
export const parseFile: ParseFile =
  ({ readFileSync, parse }) =>
  (filename) => {
    return parse(readFileSync(filename, 'utf8'));
  };
