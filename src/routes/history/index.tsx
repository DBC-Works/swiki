import { createFileRoute } from '@tanstack/react-router'

import { History } from '../../views/pages/History'

/**
 * History route
 */
export const Route = createFileRoute('/history/')({
  component: () => <History />,
})
