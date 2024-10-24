import { createFileRoute, useParams } from '@tanstack/react-router'

/**
 * Page component
 *
 * @returns JSX Element
 */
const Page: React.FC = (): JSX.Element => {
  const { pageTitle } = useParams({ from: '/pages/$pageTitle/' })
  return <h2>{pageTitle}</h2>
}

/**
 * Page route
 */
export const Route = createFileRoute('/pages/$pageTitle/')({
  component: Page,
})
