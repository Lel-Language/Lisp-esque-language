# Lisp-esque language (Lel)

Lel is a lisp like programming language. It is not meant for practical purposes, but more as a tool to learn how to write a programming language.

## Language features

- Primitive types:
  - Number
  - String
  - Boolean
  - Function
- Lexical scoping of functions and variables
- Functions form closures
- Conditionals

## Tokeniser and Parser

The lel tokeniser and parser are both written in javascript, as is the interpreter.

```lisp
(let theAnswer
  (+ 18
    (* 12 2)))

(print
  "Life the universe and everything = " theAnswer "\n")
```

becomes

```javascript
[
  [
    { isToken: true, type: 'IDENTIFIER', value: 'let' },
    { isToken: true, type: 'IDENTIFIER', value: 'theAnswer' },
    [
      { isToken: true, type: 'IDENTIFIER', value: '+' },
      { isToken: true, type: 'NUMBER', value: 18 },
      [
        { isToken: true, type: 'IDENTIFIER', value: '*' },
        { isToken: true, type: 'NUMBER', value: 12 },
        { isToken: true, type: 'NUMBER', value: 2 }
      ]
    ]
  ],
  [
    { isToken: true, type: 'IDENTIFIER', value: 'print' },
    { isToken: true, type: 'STRING', value: 'Life the universe and everything = ' },
    { isToken: true, type: 'IDENTIFIER', value: 'theAnswer' },
    { isToken: true, type: 'STRING', value: '\n' }
  ]
]
```

Which evaluates to: `Life the universe and everything = 42`.

