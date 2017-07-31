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
- Call by reference for functions
- Conditionals

### Keywords

The standard language implements a range of functionality.

#### Variables

Variables are declared with the `let` keyword, and are immutable.

```lisp
(let x 10)
```

They can of course be assigned as the result of a function:

```lisp
(let x (+ 4 6))
```

#### Functions

Functions are declared with the `function` keyword. The value last statement in a function body is the final return value.

```lisp
(function add-one (x)
  (+ x 1))

(print (add-one 1))

; -> 2
```

#### Call

Functions are first class in Lel and can be passed around in variables by reference. A function can be executed by reference using `call`:

```lisp
; Declare a function called say-hello
(function say-hello (name)
  (print "hello " name "!"))

; Create a variable with a reference to this function
(let referenced-hello say-hello)

; Call say-hello by reference
(call referenced-hello "Francis")

; -> "hello Francis!"
```

All functions are lexically scoped and form [closures](https://en.wikipedia.org/wiki/Closure_(computer_programming)), meaning they have access to the scope they were declared in while also retaining their own scope.

```lisp
(function create-adder (adding-value)
  (function new-adder (x)
    (+ x adding-value)))

(let add-five (create-adder 5))
(let add-ten (create-adder 10))

(print (add-five 10) "\n")
(print (add-ten 10) "\n")

; -> 15
;    20
```

#### Conditionals

The `if` keyword is used for condition checking. `if` is a function which takes 3 arguments, a boolean expression, a true expression and a false expression. The true and false expressions can also be lists of expressions.

```lisp
(if (< 1 2)
  (print "1 is less than 2")
  (print "1 is not less than 2...?))

; -> 1 is less than 2
```

And since `if` is a function, it always returns the evaluation of it's last statement, because of this `if` can be used like the `?` operator in many other languages. For example:

```lisp
(let emotion
  (if (< 1 2)
    "love"
    "hate"
    ))

(print "I " emotion " Lel!\n")

; -> I love Lel!
```

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

