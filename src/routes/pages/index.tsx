import { createFileRoute } from '@tanstack/react-router'

import { Pages } from '../../views/pages/Pages'

/**
 * Pages route
 */
export const Route = createFileRoute('/pages/')({
  component: () => <Pages />,
})
