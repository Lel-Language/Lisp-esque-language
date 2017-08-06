const createScope = require('../../create-scope');
const lelPromise = require('../../../../util/lel-promise');
const lelSeries = require('../../../../util/lel-series');

module.exports = (evaluateExpr, scope, args, functionDescriptor) =>
  lelPromise((resolve, reject) => {
    // Every time the function runs it gets it's own scope, meaning variables set inside this function
    // will not persist across different calls.
    const executionScope = createScope(functionDescriptor.scope);

    if (args.length !== functionDescriptor.expectedArguments.length) {
      reject(new Error(`Expected ${functionDescriptor.expectedArguments.length} arguments for function ${functionDescriptor.name} but got ${args.legnth}`));
    }

    // Place arguments into the execution scope
    args.forEach((argument, i) =>
      executionScope.variables[functionDescriptor.expectedArguments[i]] = argument
    );

    const bodyEvaluators = functionDescriptor
      .bodyExpressions
      .map(fExpr => () => evaluateExpr(executionScope, fExpr));

    lelSeries(bodyEvaluators).then(values => resolve(values[values.length-1]));
  });
