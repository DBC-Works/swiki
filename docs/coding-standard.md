# Coding standard

## JavaScript

### Prefer newer features over older ones

As a general rule, when there is a similar function in JavaScript, use the newer function. New features in JavaScript generally improve the shortcomings of older features.

#### Syntax

- Do not use [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
- Use [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) over [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- Use [arrow function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) over [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - Exceptions: [Generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), functions that must refer to the [arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments), and other functions that cannot be implemented using arrow functions
- Do not use default export

#### DOM Operation

- Use [Element: querySelector() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) or [Element: querySelectorAll() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) over [Document: getElementById() method](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById), [Element: getElementsByClassName() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName) or [Element: getElementsByTagName() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName)

#### Event handling

- Use observers over events if present
  - [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  - [Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API)
  - [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/Mutation_Observer)

## TypeScript

- Exported definitions should be as explicitly typed as possible

## React

- Do not use [class component](https://react.dev/reference/react/Component)
