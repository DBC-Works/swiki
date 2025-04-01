# 14. Use ArkType

Date: 2025-04-02

## Status

Accepted

## Context

<!--
We need date and time handling library.

- Current JavaScript date and time handling capabilities are not enough
- [Temporal](https://tc39.es/proposal-temporal/docs/index.html), which is still in the works, doesn't seem to be stable yet
  -->

## Decision

We use [ArkType](https://arktype.io/).

Compared to [Zod](https://zod.dev/), we decided that the following would be suitable for swiki:

- Compact size
- More human readable rule description
