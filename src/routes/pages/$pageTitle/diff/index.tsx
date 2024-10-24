import { Link, createFileRoute, useParams } from '@tanstack/react-router'

/**
 * Page edit history component
 * @returns JSX Element
 */
const PageEditHistory: React.FC = (): JSX.Element => {
  const { pageTitle } = useParams({ from: '/pages/$pageTitle/diff/' })
  return (
    <div>
      <h2>{pageTitle} edit history</h2>
      <ul>
        <li>
          <Link to="/pages/$pageTitle/diff/$number" params={{ pageTitle, number: '1' }}>
            diff
          </Link>
        </li>
      </ul>
    </div>
  )
}

/**
 * Page edit history route
 */
export const Route = createFileRoute('/pages/$pageTitle/diff/')({
  component: PageEditHistory,
})
