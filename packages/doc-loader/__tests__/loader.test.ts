import webpack from 'webpack';
import * as path from 'path';

async function createBundle({ fixture, output }: { fixture: string; output: string }) {
  await new Promise((resolve, reject) => {
    webpack(
      {
        entry: path.resolve(__dirname, 'fixtures', fixture),
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.md$/,
              use: [
                {
                  loader: path.resolve(__dirname, '../lib/loader.ts'),
                },
              ],
            },
          ],
        },
        output: {
          library: {
            type: 'commonjs2',
          },
          path: path.resolve(__dirname, 'output'),
          filename: output,
        },
      },
      (error, stats) => {
        if (error) {
          reject(error);

          return;
        }
        if (stats.hasErrors()) {
          reject(stats.compilation.errors[0]);

          return;
        }
        if (stats.hasWarnings()) {
          reject(stats.compilation.warnings[0]);

          return;
        }
        resolve(error);
      }
    );
  });

  const result = await import(`./output/${output}`);

  // The result is wrapped in 2 default exports:
  // - The html-loader creates an ESM with the string assigned to export default
  // - The final bundle is a CommonJS module that re-exports the result from the html-loader
  return result.default;
}

test('convert markdown to docKeyMap ', async () => {
  const code = await createBundle({
    fixture: 'docKeyMap.md',
    output: 'docKeyMap.cjs',
  });
  expect(code).toHaveProperty('doc1');
  expect(code).toHaveProperty('doc2');
  expect(code).toHaveProperty('doc3');
});
