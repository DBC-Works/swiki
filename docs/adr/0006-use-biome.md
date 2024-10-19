# 6. Use Biome

Date: 2024-10-19

## Status

Accepted

## Context

We should use linter and formatter.

## Decision

We use [Biome](https://biomejs.dev/).

The de facto standard for TypeScript is [Prettier](https://prettier.io/)(formatter) and [ESLint](https://eslint.org/)(linter), but Biome has both functions and is simple to configure.

## Consequences

### Positive

By combining Biome with [Lefthook](https://github.com/evilmartians/lefthook), it can be automated to check and format on commit.

### Negative

Biome formatter only supports JavaScript, Typescript, CSS and JSON.
