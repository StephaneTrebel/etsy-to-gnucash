import { readFileSync } from 'fs';
import { join } from 'path';

import { main } from './main';
const mockFile = readFileSync(
  join(__dirname, '../test/CA20210928_184319_simple.ofx'),
  {
    encoding: 'utf8',
  }
);

const mockDependencies = {
  logger: { log: () => {}, error: () => {} },
  readFile: () => Promise.resolve(mockFile),
  writeFile: () => Promise.resolve(),
} as any;

describe('main()', () => {
  describe('When called with its dependencies and a file list', () => {
    it('Should return Void', () => {
      expect(
        main(mockDependencies)({ filenameList: [''], outDir: '' })
      ).resolves.toBeUndefined();
    });
  });
});
