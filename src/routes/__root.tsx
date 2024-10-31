import { Outlet, createRootRoute } from '@tanstack/react-router'

import { App } from '../views/templates/App'

/**
 * Root route
 */
export const Route = createRootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
})
