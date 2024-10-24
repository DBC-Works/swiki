import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'

/**
 * Router
 */
const router = createRouter({
  routeTree,
  defaultErrorComponent: () => <h2>Error</h2>,
  defaultNotFoundComponent: () => <h2>Not found</h2>,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
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
