import { parseFile } from './csv';

describe('CSV', () => {
  describe('parseFile()', () => {
    describe('Given a filename', () => {
      it('Should return parsed arguments', () => {
        expect(
          parseFile({
            readFileSync: (_: string) => 'toto',
            parse: () => 'titi',
          })('test')
        ).toEqual({ input: 'input', output: 'output' });
      });
    });
  });
});
