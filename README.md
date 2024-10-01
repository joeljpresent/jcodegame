# JCodeGame

A toy website which includes a coding environment for a custom, minimal language.
This can be used for carrying out coding challenges.

## Memory model

The memory layout consists of 16 memory cells, numbered from 0 to 15, and one register value called *cur* (short for "current valent").
They are all initialized to zero.

All values are 32-bit signed integers, i.e. a whole number between −2 147 483 648 and 2 147 483 647.

## Syntax

### Value literals

Values can be written in base 10 (`15`, `-3`) or in base 16 with the `0x` prefix (`0x2fc`, `-0xcafe`).
They must be within the range of 32-bit signed integers.

They can also be written as character literals in single quotes (`'a'`, `'ë'`, `'🦝'`); the actual resulting value is the Unicode Scalar Value of the character, which is a signed 32-bit integer like any other value.

Character literals for a single quote or a backslash must be escaped with a backslash (`'\''`, `'\\'`).
Other escape sequences exist for some control characters:

- `'\b'`: backspace
- `'\f'`: formfeed
- `'\n'`: linefeed
- `'\r'`: carriage return
- `'\t'`: tabulation

### Cell addresses

Each of the 16 memory cells can be referred to with a cell address consisting of `@` followed by the cell index (`@0` to `@15`).

A dereference address consists of `*` followed by the cell index (`*0` to `*15`).
This refers to the cell whose index is the value of the cell with the given index.
For example, if the cell #4 has value `7`, then `*4` refers to the cell #7.

### Script

The script must be written in JCGL (JCodeGame Language), a custom programming language with minimal instructions.
Each instruction must be written as a single line that starts with a command name optionally followed by parameters.

Comments start with `#` and can be appended at the end of a line of code.
Everything from the `#` character to the end of the line will be ignored by the parser.

In the following command descriptions, a "value parameter" refers to a value literal, a cell address or a dereference address.

#### Command `read`

A single value is popped from the Input and assigned to *cur*.
If this command is called when the Input is empty, the program will stop gracefully.

#### Command `write`

The *cur* value is pushed to the Output.

#### Command `load`

This command takes one value parameter.

The parameter's value is assigned to *cur*.

For example:

- `load 38` assigns the value 38 to *cur*
- `load @4` assigns the value of the cell #4 to *cur*
- `load *4` assigns the value of the cell whose index is the value of the cell #4 to *cur*

#### Command `store`

This command takes one parameter that is a cell address or a dereference address.

The *cur* value is assigned the referred cell.

For example:

- `store @4` assigns the *cur* value to cell #4
- `store *4` assigns the *cur* value to the cell whose index is the value of the cell #4

#### Command `add`

This command takes one value parameter.

The parameter's value is added to the *cur* value.

For example, if the *cur* value is initially 10, `add 7` will change the *cur* value to 17 (i.e., 10 + 7).

#### Command `sub`

This command takes one value parameter.

The parameter's value is substracted to the *cur* value.

For example, if the *cur* value is initially 10, `sub 7` will change the *cur* value to 3 (i.e., 10 − 7).

#### Command `label`

This command takes one parameter that is a case-sensitive name which can only include letters, digits and `_`.

A label is an anchor in the script that can be used as destination for a jump command.

For example, `label start` creates a label that is named `start`.

#### Command `jump`

This command takes a label name as a parameter.

The control flow breaks and goes to the label whose name is the provided parameter.

For example, `jump start` goes to the label called `start`.

#### Command `jumpif`

This command takes three arguments:

- an comparison operator: `lt` (less than), `le` (less than or equal to), `eq` (equals), `ne` (not equal), `ge` (greater than or equal to), `gt` (greater than)
- a value parameter
- a label name

If the *cur* value satisfies the comparison described by the comparison operator with regard to the value parameter, jump to the label of the specified name.

For example, `jumpif lt 5 start` will only jump to `start` if the *cur* value is less than 5.
