import { RouterProvider, type ToOptions, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'

import i18next from './i18n'
import { routeTree } from './routeTree.gen'
import { Section } from './views/templates/Section'

/**
 * Router
 */
const router = createRouter({
  routeTree,
  defaultErrorComponent: () => (
    <Section>
      <h2>{i18next.t('Error')}</h2>
    </Section>
  ),
  defaultNotFoundComponent: () => (
    <Section>
      <h2>{i18next.t('Not found')}</h2>
    </Section>
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface HistoryState {
    returnPath?: ToOptions['to'] | string
  }
}

//
// Entry
//

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
