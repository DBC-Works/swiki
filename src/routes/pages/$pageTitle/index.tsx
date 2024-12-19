import { createFileRoute } from '@tanstack/react-router'

import { Page as PageViewer } from '../../../views/pages/Page'

/**
 * Page component
 *
 * @returns JSX Element
 */
const Page: React.FC = (): JSX.Element => <PageViewer />

/**
 * Page route
 */
export const Route = createFileRoute('/pages/$pageTitle/')({
  component: Page,
})
