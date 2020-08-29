<img height="300" src="./res/argzilla.svg"/>

# Argzilla
A simple argparse generator developed by LugoCorp

- Flags (no value passed in)
- Options (you pass a value)
- Commands

## Building
This repository comes with a couple of npm commands for building and testing.
- `npm run build` - build the TypeScript code
- `npm run test` - run the built code

## Basic algorithm
`program [command] [flags | options | args]`

- For each input argument
  - Check for command
  - Check against flags
  - Check against options
  - Anything else is an arg

## Targets
#### Phase 1
- [ ] JavaScript
- [ ] Python
- [ ] Bash
- [ ] Ruby
- [ ] Java
- [ ] C++
- [ ] Lua

#### Phase 2
- [ ] Golang
- [ ] OCaml
- [ ] Rust
- [ ] Dart
- [ ] PHP
- [ ] C#
- [ ] R

## Nodes
Argzilla is a partial evaluator, so it basically produces some code attuned to a config input (your argzilla.json file). Partial evaluators also input some source code (which they have to parse into an AST), but Argzilla skips directly to the AST. Well actually it isn't ever stored as a tree, but conceptually this is how we view it to help keep the interface consistent across renderers.
### Init node
```
This is the entry node for Argzilla outputs. Yields a comment and function wrapper then checks for min arguments after visiting the inner nodes
```

### Command node
```
This node checks for commands if it exists. If there is a command then the loop node needs to start on the argument after it
```

### Loop node
```
This node accesses the command line arguments, provides a handle to them and houses the different param nodes
```

### Flag node
```
Sets a flag to true if the current parameter equals any label of that flag
```

### Option node
```
Sets an option to the next parameter if the current parameter equals any label of that option
```

### Arg node
```
Check for max arguments and then adds the current parameter to the arguments list
```
