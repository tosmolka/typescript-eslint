/*
  Experimental ESLint rule ported from https://github.com/microsoft/tslint-microsoft-contrib/blob/master/src/noCookiesRule.ts
 */

import { TSESTree } from '@typescript-eslint/experimental-utils';
import * as util from '../util';

type Options = [];
type MessageIds = 'noCookiesMessage';

export default util.createRule<Options, MessageIds>({
  name: 'no-cookies',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Do not use cookies',
      category: 'Best Practices',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      noCookiesMessage: "Forbidden call to document.cookie",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = util.getParserServices(context);
    const program = parserServices.program;
    const checker = program.getTypeChecker();

    /*
      TODO:
        - TSLint rule seems to be more generic when type information is not available and flag every access to property named "cookie".
    */
    return {
      // Access to "cookie" property
      'MemberExpression[property.type="Identifier"][property.name="cookie"]'(
        node: TSESTree.MemberExpression
      ): void
      {
        if (
          // document.cookie
          // this.document.cookie
          // window.document.cookie
          node.object.type === "Identifier" && node.object.name === "document" ||
          node.object.type === "MemberExpression" && (
            (
              node.object.object.type === "ThisExpression" &&
              node.object.property.type === "Identifier" &&
              node.object.property.name === "document"
            ) ||
            (
              node.object.object.type === "Identifier" &&
              node.object.object.name === "window" &&
              node.object.property.type === "Identifier" &&
              node.object.property.name === "document"
            )
          )
        )
        {
          context.report({
            node: node,
            messageId: 'noCookiesMessage',
          });
        }

        // TODO:
        //  Handle property access based on Type information
        //    var doc = document; doc.cookie
        //  Following code might be a good start but does not really work as expected.

        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const type = checker.getTypeAtLocation(tsNode.expression);
        const symbol = type.getSymbol();

        if (symbol?.getName() === "Document")
        {
          // ...
        }
      }
    }
  },
});
