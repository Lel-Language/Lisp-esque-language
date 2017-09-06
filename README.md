# Lisp-esque language (Lel)

Lel is a lisp like programming language. It is not meant for practical purposes, but more as a tool to learn how to write a programming language.

This project comes with a Lel interpreter for running Lel programs, and a REPL for executing Lel expressions in real time.

## Running

### Installation 

You can clone the repo.

```bash
git clone https://github.com/francisrstokes/Lisp-esque-language.git
cd Lisp-esque-language
npm i
```

Or install from npm

```bash
npm i -g lel-lang
```

### REPL

```bash
lel
```

### Interpreter

```bash
lel examples/helix.lel
```

## Language features

- Primitive types:
  - Number
  - String
  - Boolean
  - Function
  - List
- Lexical scoping of functions and variables
  - Functions form closures
  - Anonymous functions through lambdas
  - Call and apply by reference for functions
- Modules
  - Code can be split across files into isolated modules
  - Loaded with `import` keyword
- Extendable
  - Allows extension of the language through js modules
- Conditionals
- List mapipulation
- Stack safety
  - Recursive functions do not lead to stack overflow exceptions even without tail calls


### The Lel Language

#### Variables

Variables are declared with the `let` keyword.

```lisp
(let x 10)
```

They can of course be assigned as the result of a function:

```lisp
(let x (+ 4 6))
```

A variable can be modified using the the `mutate` keyword, though it should be avoided where possible.

```lisp
(let count 1)
(print count "\n")
(mutate count (+ count 1))
(print count "\n")

; -> 1
;    2
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

#### Apply

Apply is like call except the arguments are provided as a List, or a reference to a list:

```lisp
(function say-hello (name)
  (print "hello " name "!"))

(let args (list "Francis"))
(print (apply say-hello args))
(print (apply say-hello (list "Mr. Stokes")))

; -> "hello Francis!"
;    "hello Mr. Stokes!"
```

#### Lambda

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

Which might be better named as a `lambda call` in Lel.

#### Conditionals

The `if` keyword is used for condition checking. `if` is a function which takes 3 arguments, a boolean expression, a true expression and a false expression. The true and false expressions can also be lists of expressions.

```lisp
(if (< 1 2)
  (print "1 is less than 2")
  (print "1 is not less than 2...?"))

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
- Boolean `#true` or `#false`
- List `(2 4 6 8 10)`
- Function `(lambda (x) (* 3 (* x x)))`

##### Number

The number type is a signed 64-bit double, just like javascript.

```lisp
(let positive 5)
(print positive)

; -> 5

(let negative -5)
(print negative)

; -> -5

(let floating 42.2)
(print floating)

; -> 42.2
```

##### String

A string is a string of characters contained in double quotes:

```lisp
(print "hello")

; -> hello
```

Strings can be combined with `concat`:

```lisp
(let hello-str "hello ")
(print (concat hello-str "world"))

; -> hello world
```

##### Boolean

Boolean can be either true or false, and are represented with the identifiers `true` and `false`:

```lisp
(let true-thing true)
(let false-thing false)
(print true-thing ", " false-thing)

; -> true, false
```

Booleans are also the return type of comparison functions, for example:

```lisp
(print (> 2 1))

; -> true
```

##### List

Lists hold groups of data similar to arrays. A variable holding a list can also be used as the arguments to a function.

Lists are declared with the `list` keyword.

```lisp
(let primes-under-ten
  (list 2 3 5 7))
```

In Lel there is some syntactic sugar for creating list ranges:

```lisp
(let ranged-list
  (list 1 .. 10))

; -> (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
```

Ranges can be ascending and descending.

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

You can get a list of all the elements from *start* to *end* indexes with `sublist`:

```lisp
(let main-list (list 0 1 2 3 4 5))
(print (sublist main-list 1 4))

; -> (1, 2, 3, 4)
```

You can also grab the nth element of the list with `nth`. The list is zero indexed, just like an array.

```lisp
(print (nth (list 1 2 3) 1))

; -> 2
```

You can get the number of elements in a list with `length`:

```lisp
(print (length (list 1 2 3)))

; -> 3
```

Finally, you can combine lists with `concat` just like strings:

```lisp
(let list-one
  (list 1 2 3 4 5))
(let list-two
  (list 6 7 8 9 10))
(print (concat list-one list-two))

; -> (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
```

From these functions more operations are quite easily composable. For instance if you wanted the last element of a list, you could write a function like:

```lisp
(let planets (list "earth" "mars" "saturn" "jupiter"))

(function last-element (l)
  (let list-length
    (length l))
  (let final-index
    (- list-length 1))
  (nth l final-index))

(print (last-element planets) "\n")

; -> jupiter
```

##### Function

A function is just a data type like the others in Lel, and thus can be stored in a variable, in a list, passed as an argument into a function, be returned from a function.


#### Modules

Modules can be imported from a file with `import`.

```lisp
; FILE_A.lel
(lambda ()
  (print "hello from FILE_A.lel!\n"))
```

```lisp
; FILE_B.lel
(let from-file-a (import "./FILE_A.lel"))
(call from-file-a)

; -> hello from FILE_A.lel!
```

The evaluated result of an import is the final value of the module (like a function), but an imported module will also inject the variables defined in it's scope into the the importing module. Scope injection can be avoided by only exporting a `lambda` function or primitive value, or by wrapping the code of the module inside a lambda call.

Imported modules run in their own scope, but can recieve access via closures and dependency injection.

#### Standard Libraries

The standard libraries can be accessed with the `use` keyword. Libraries are loaded loaded into the runtime as language-level keywords. For example, the math library:

```lisp
(use "math")

(print (math-sin 4.2))

-> -0.8715757724135882
```

The current standard library includes

- Math
  - math-sin
  - math-cos

## Tokenisation, Parsing, and Evaluation

The lel tokeniser and parser are both written in javascript from scratch. The tokeniser recognises just 8 tokens: numbers, strings, booleans, left and right parentheses, comments and whitespace, and identifiers.

The parser transforms the stream of tokens into an AST (abstract syntax tree) which describes those tokens in terms of the semantics of S-expressions. Every '(' signifies the start of a new branch in the tree and every matching ')' signifies the end of that branch.

The interpreter evaluates the AST. Evaluation is a recursive process where each branch of the tree is an "expression", and is handed to a function called `evaluateExpr`. Sub expressions inside the expression are then evaluated by `evaluateExpr` until the result returns a primitive value of the language. This could easily lead to stack overflow exceptions when nesting of expressions is too high, so all expression evaluation is handled with asynchronous promises because promise evaluation does not work with the call stack.
