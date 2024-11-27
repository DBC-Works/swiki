# 13. Use dayjs

Date: 2024-11-27

## Status

Accepted

## Context

We need date and time handling library.

- Current JavaScript date and time handling capabilities are not enough
- [Temporal](https://tc39.es/proposal-temporal/docs/index.html), which is still in the works, doesn't seem to be stable yet

## Decision

We use [Day.js](https://day.js.org/).

Avoid using [date-fns](https://date-fns.org/) as it is used in conjunction with [Date object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date).

## Consequences

- We try to avoid using Date object
- We will change to Temporal once it stable
