import { createFileRoute, useParams } from '@tanstack/react-router'

/**
 * Page edit component
 * @returns JSX element
 */
const PageEdit: React.FC = (): JSX.Element => {
  const { pageTitle } = useParams({ from: '/pages/$pageTitle/edit' })
  return <h2>{pageTitle}(edit)</h2>
}

/**
 * Page edit route
 */
export const Route = createFileRoute('/pages/$pageTitle/edit')({
  component: PageEdit,
})
