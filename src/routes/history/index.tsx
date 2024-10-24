import { createFileRoute } from '@tanstack/react-router'

/**
 * History component
 * @returns JSX element
 */
const Index: React.FC = (): JSX.Element => <h3>History</h3>

/**
 * History route
 */
export const Route = createFileRoute('/history/')({
  component: Index,
})
