<div align="center">

![logo](./.assets/logo.png)

# Dots and Boxes Game Engine

Scripting runtime for simulating game sessions of Dots and Boxes.

</div>

## Installation

Download the [latest release](https://github.com/PSH-Computing-AI-club/competition-spring-2025-dotsandboxes/releases) for your operating system and put it in a directory listed in your `PATH` variable.

## Usage

```shell
$ dotsandboxes-{OS} --help

Usage:   dotsandboxes-{OS}
Version: 0.0.2       

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

> **NOTE:** You need internet access for the first time you run a simulation so [`deno_emit`](https://github.com/denoland/deno_emit) can download its payload.

```shell
$ dotsandboxes-{OS} simulate --help

Usage:   dotsandboxes-{OS} simulate <files...>
Version: 0.0.2                                 

Description:

  Simulates a Dots and Boxes game session.

Options:

  -h, --help                    - Show this help.                                                                                                         
  --output-file   [outputFile]  - Determine the file used for output.                                                                                     
  --output-kind   [outputKind]  - Determine the format used for output.                                       (Default: "human", Values: "human", "jsonl")
  --grid-columns  [columns]     - Determine how many columns of dots is in gameboard.                         (Default: 5)                                
  --grid-rows     [rows]        - Determine how many rows of dots is in gameboard.                            (Default: 3)                                
  --seed          [seed]        - Determine what value to initially seed random number generators with.       (Default: 1738463778408)                    
  --timeout       [timeout]     - Determine how long in milliseconds should each player get to compute their  (Default: 1000)                             
                                  turns.                                                                                                                  

Examples:

  Simulate Two JavaScript Players: dotsandboxes-{OS} ./random_player.js ./strategic_player.js
  Simulate Two TypeScript Players: dotsandboxes-{OS} ./random_player.ts ./strategic_player.ts
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

- [`github.com/PSH-Computing-AI-club/competition-spring-2025-placeholder-competitor`](https://github.com/PSH-Computing-AI-club/competition-spring-2025-placeholder-competitor)
