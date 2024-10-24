import { Link, createFileRoute } from '@tanstack/react-router'

/**
 * Pages component
 * @returns JSX.Element
 */
const Pages: React.FC = (): JSX.Element => (
  <div>
    <h3>Pages</h3>
    <ul>
      <li>
        <Link to="/pages/$pageTitle" params={{ pageTitle: 'page1' }}>
          page1
        </Link>
      </li>
      <li>
        <Link to="/pages/$pageTitle/edit" params={{ pageTitle: 'page2' }}>
          page2(edit)
        </Link>
      </li>
      <li>
        <Link to="/pages/$pageTitle/diff" params={{ pageTitle: 'page3' }}>
          page3(diff)
        </Link>
      </li>
    </ul>
  </div>
)

/**
 * Pages route
 */
export const Route = createFileRoute('/pages/')({
  component: Pages,
})
