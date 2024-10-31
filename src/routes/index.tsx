import { createFileRoute } from '@tanstack/react-router'

import { FrontPage } from '../views/pages/FrontPage'

/**
 * FrontPageRoute component
 * @returns JSX Element
 */
const FrontPageRoute: React.FC = (): JSX.Element => <FrontPage />

/**
 * FrontPage route
 */
export const Route = createFileRoute('/')({
  component: FrontPageRoute,
})
