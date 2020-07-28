# Argzilla
<img height="300" src="./res/argzilla.svg"/>
<br><br>
A simple argparse generator developed by LugoCorp

- Flags (no value passed in)
- Options (you pass a value)
- Commands

## Basic algorithm
`program [command] [flags | options | args]`

- For each input argument
  - Check for command (not yet implemented)
  - Check against flags
  - Check against options
  - Anything else is an arg (if no command)

## Future Features
- Commands (Set of possible options changes by the command)
