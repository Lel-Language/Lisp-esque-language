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

#### Lambdas

A `Lambda` is a special kind of anonymous function that is not placed into scope when it's declared:

```lisp
(let anon-func
  (lambda (x)
    (* x x)))

(call anon-func 5)

; -> 25
```

They can also act like javascript's [Immediately-invoked function expressions](http://benalman.com/news/2010/11/immediately-invoked-function-expression/):

```lisp
(call
  (lambda (x)
    (let xs (* x x x))
    (print x " cubed is " xs "\n"))
  5)

; -> 5 cubed is 125
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

#### Types

Lel has 5 types:

- Number `10.5`
- String `"Hello"`
- Boolean `T` or `F`
- List `(2 4 6 8 10)`
- Function `(lambda (x) (* 3 (* x x)))`

##### Lists

Lists hold groups of data similar to arrays. A variable holding a list can also be used as the arguments to a function.

Lists are declared with the `list` keyword.

```lisp
(let primes-under-ten
  (list 2 3 5 7))
```

Lists can be mapped over with the `map` keyword:

```lisp
(function multiply-by-index (item index)
  (* item index))
(print (map primes-under-ten multiply-by-index))

; -> (0 3 10 21)
```

Note that mapping functions must have a two argument signature. `map` can also take an inline lambda function.

You can get the first element in the list with `head`:

```lisp
(print (head (list 1 2 3)))

; -> 1
```

And you can get everything else in the list with `tail`:

```lisp
(print (tail (list 1 2 3)))

; -> (2, 3)
```

You can also grab the nth element of the list with `nth`. The list is zero indexed, just like an array.

```lisp
(print (nth (list 1 2 3) 1))

; -> 2
```

Finally, you can get the length of the list with `length`:

```lisp
(print (length (list 1 2 3)))

; -> 3
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

