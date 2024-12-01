import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import React from 'react'
import './i18n'

import { type RenderResult, render } from '@testing-library/react'
import { type UserEvent, userEvent } from '@testing-library/user-event'

/**
 * Set up result type
 */
export type SetUpResult = {
  /**
   * User event
   */
  userEvent: UserEvent

  /**
   * Render result
   */
  renderResult: RenderResult
}

/**
 * Set up component under test
 * @param component Component under test
 * @returns Set up result for test
 */
export const setupComponentUnderTest = (component: React.ReactNode): SetUpResult => ({
  userEvent: userEvent.setup(),
  renderResult: render(<React.StrictMode>{component}</React.StrictMode>),
})

type JotaiPropsType = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  initialValues: any
  children: JSX.Element
}

/**
 * Hydrate atoms component
 * @param props Props
 * @param props.initialValues State initial value
 * @param props.children Children
 * @returns JSX Element
 */
export const HydrateAtoms = ({ initialValues, children }: JotaiPropsType): JSX.Element => {
  useHydrateAtoms(initialValues)
  return children
}

/**
 * Test provider component
 * @param props Props
 * @param props.initialValues State initial value
 * @param props.children Children
 * @returns JSX Element
 */
export const TestProvider = ({ initialValues, children }: JotaiPropsType): JSX.Element => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
)
