<div align="center">

![logo](./.assets/logo.png)

# Dots and Boxes Game Engine

Scripting runtime for simulating game sessions of Dots and Boxes.

</div>

## Installation

Download the [latest release](https://github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes/releases) for your operating system and put it in a directory listed in your `PATH` variable.

## Usage

```shell
$ dotsandboxes --help

Usage:   dotsandboxes
Version: 0.0.1       

Description:

  Game engine for simulating Dots and Boxes game sessions.

Options:

  -h, --help                   - Show this help.                                                                        
  -V, --version                - Show the version number for this program.                                              
  --output-file  [outputFile]  - Determine the file used for output.                                                    
  --output-kind  [outputKind]  - Determine the format used for output.      (Default: "human", Values: "human", "jsonl")

Commands:

  simulate  <files...>  - Simulates a Dots and Boxes game session.
```

### Simulate

```shell
$ dotsandboxes simulate --help

Usage:   dotsandboxes simulate <files...>
Version: 0.0.1                           

Description:

  Simulates a Dots and Boxes game session.

Options:

  -h, --help                    - Show this help.                                                                                                         
  --output-file   [outputFile]  - Determine the file used for output.                                                                                     
  --output-kind   [outputKind]  - Determine the format used for output.                                       (Default: "human", Values: "human", "jsonl")
  --grid-columns  [columns]     - Determine how many columns of dots is in gameboard.                         (Default: 5)                                
  --grid-rows     [rows]        - Determine how many rows of dots is in gameboard.                            (Default: 3)                                
  --seed          [seed]        - Determine what value to initially seed random number generators with.       (Default: 1736428032852)                    
  --timeout       [timeout]     - Determine how long in milliseconds should each player get to compute their  (Default: 1000)
```

## Player Scripting API Reference

Find the API Reference for the player scripting runtime at [`psh-computing-ai-club.github.io/competition-spring-2025-dotsandboxes`](https://psh-computing-ai-club.github.io/competition-spring-2025-dotsandboxes).

## License

The Dots and Boxes game engine is [licensed](./LICENSE) under the MIT License.

## Related Repositories

- [`github.com/PSH-Computing-AI-club/competition-spring-2025`](https://github.com/PSH-Computing-AI-club/competition-spring-2025)

- [`github.com/PSH-Computing-AI-club/competition-spring-2025-bracket`](https://github.com/PSH-Computing-AI-club/competition-spring-2025-bracket)

- [`github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes-template-javascript`](https://github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes-template-javascript)

- [`github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes-template-typescript`](https://github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes-template-typescript)
