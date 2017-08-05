const createScope = require('../../create-scope');

const {mapSeries} = require('bluebird');

module.exports = (evaluateExpr, scope, args, functionDescriptor) =>
  new Promise((resolve, reject) => {
    // Every time the function runs it gets it's own scope, meaning variables set inside this function
    // will not persist across different calls.
    const executionScope = createScope(functionDescriptor.scope);

    if (args.length !== functionDescriptor.expectedArguments.length) {
      throw new Error(`Expected ${functionDescriptor.expectedArguments.length} arguments for function ${functionDescriptor.name} but got ${args.legnth}`);
    }

    // Place arguments into the execution scope
    args.forEach((argument, i) =>
      executionScope.variables[functionDescriptor.expectedArguments[i]] = argument
    );

    const bodyEvaluators = functionDescriptor
      .bodyExpressions
      .map(fExpr => () => evaluateExpr(executionScope, fExpr).catch(console.error));

    mapSeries(bodyEvaluators, (promiseGetter) => promiseGetter())
      .then(values => resolve(values[values.length-1]));
  }).catch(console.error);
