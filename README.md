# Brainfuck-Interpreter

Brainfuck interpreter using a parser generated with [Jison](https://github.com/zaach/jison).

## Running a brainfuck program

`node src/bf examples/hello_world.bf`

Will run the example hello world program.

## Extending the grammar

The parser only allows whitespace and the regular brainfuck symbols. If you want to add comments of features from other brainfuck-like languages, then you'll need to extend the grammar file and generate a new parser.

First install dependencies: `npm i`

Tokens and grammar are defined in `grammar/brainfuck.jison`. To compile the grammar to a parser yourself, run `npm run generate_parser`.
