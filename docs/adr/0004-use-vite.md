# 4. Use Vite

Date: 2024-10-19

## Status

Accepted

## Context

We need build tool for develop.

- TypeScript requires compilation
- The app requires bundled JavaScript

## Decision

We use [Vite](https://ja.vite.dev/).

Vite's developer experience is better than build tools that was commonly used before the release of Vite([webpack](https://webpack.js.org/), [Parcel](https://ja.parceljs.org/), etc)

## Consequences

Vitest built-in development server can be used.
