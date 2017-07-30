# Lisp-esque language (Lel)

Lel is a lisp like programming language. It is not mean for practical purposes, but more as a tool to learn how to write a programming language.

## Language features


## Parser

The lel parser takes a basic S-expression based language in and produces an AST representing the program. For example:

```lisp
(print
  (+ 18
  (* 11 2)))
```

becomes

```javascript
[
  [
    ["IDENTIFIER", "print"],
    [
      ["IDENTIFIER", "+"],
      ["NUMBER", 18],
      [
        ["IDENTIFIER", "*"],
        ["NUMBER", 11],
        ["NUMBER", 2]
      ]
    ]
  ]
]
```

Which evaluates to the meaning of life, the universe, and everything.

