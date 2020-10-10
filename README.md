<img height="300" src="./res/argzilla.svg"/>

# Argzilla
Argzilla is a simple argparse generation tool developed by LugoCorp. You can find out more about it on the [official website]().

Argzilla handles the following command line elements:

- **Flags:**
This is an element you can pass in and then check for its existence at runtime. Flags are either present or they are not.

- **Options:**
Options are like a flag but you assign a value to them from the command line. These values are always represented as a string at runtime.

- **Commands:**
A command is the first element in an argument list (if it exists). It's a special word that tells your program specifically what the user wants to do. Git has commands like 'add' and 'commit'.

## Usage
```
Argzilla command-line tool by LugoCorp

Usage: argzilla [command] <options>

Commands:
  init  -  prints out a blank argzilla.json file

Options:
  -p, --print     Prints the output instead of writing to a file
  -o file         Selects which file to write to
  -f file         Selects an argzilla.json file to read from
  -l lang         Selects which language to render in (python, node, ruby, bash, lua, cpp)
  --help          Displays usage
```

## Targets
Argzilla can generate code in the following languages:
- JavaScript
- Python
- Bash
- Ruby
- C++
- Lua
