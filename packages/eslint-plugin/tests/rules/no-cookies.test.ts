/*
  Ported from https://github.com/microsoft/tslint-microsoft-contrib/blob/master/src/tests/NoCookiesTests.ts
 */
import rule from '../../src/rules/no-cookies';
import { RuleTester, getFixturesRootDir } from '../RuleTester';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
    tsconfigRootDir: getFixturesRootDir(),
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
});


ruleTester.run('no-cookies', rule, {
  valid: [
`interface DocumentLikeAPI {
    cookie: string;
}

function documentLikeAPIFunction(): DocumentLikeAPI {
    return null;
}

// These usages are OK because they are not on the DOM document
var document2: DocumentLikeAPI = documentLikeAPIFunction();
document2.cookie = '...';
document2.cookie = '...';
documentLikeAPIFunction().cookie = '...';`,
  ],
  invalid: [
    {
      code:
`function documentFunction(): Document {
  return window.document;
}

document.cookie = '...';
this.document.cookie = '...';
window.document.cookie = '...';

documentFunction().cookie = '...';

var doc = document;
doc.cookie = '...';`,
      errors: [
        {
          messageId: 'noCookiesMessage',
          line: 5,
          column: 1,
        },
        {
          messageId: 'noCookiesMessage',
          line: 6,
          column: 1,
        },
        {
          messageId: 'noCookiesMessage',
          line: 7,
          column: 1,
        },
        {
          messageId: 'noCookiesMessage',
          line: 9,
          column: 1,
        },
        {
          messageId: 'noCookiesMessage',
          line: 12,
          column: 1,
        },
      ],
    },
  ],
});
