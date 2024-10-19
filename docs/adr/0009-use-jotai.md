# 9. Use Jotai

Date: 2024-10-19

## Status

Accepted

## Context

We need state management library.

## Decision

We use [Jotai](https://github.com/pmndrs/jotai).

Jotai is simple but powerful.

## Consequences

Jotai has state persistence function using localStorage. So this app also uses localStorage to persist state initially. This may be reconsidered in the future.
