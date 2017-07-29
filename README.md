# Lisp-esque language (lel) parser

The lel parser takes a basic S-expression based language in and produces an AST representing the program. For example:

```lisp
(add 18
  (multiply 11 2))
```

becomes

```javascript
[
  [
    ["IDENTIFIER", "add"],
    ["NUMBER", 18],
    [
      ["IDENTIFIER", "multiply"],
      ["NUMBER", 11],
      ["NUMBER", 2]
    ]
  ]
]
```

## Tokeniser and Parser

The tokeniser and parser functionalities are written from scratch in javascript. 
