import { createFileRoute, useParams } from '@tanstack/react-router'

/**
 * Page diff component
 * @returns JSX Element
 */
const PageDiff: React.FC = (): JSX.Element => {
  const { number, pageTitle } = useParams({
    from: '/pages/$pageTitle/diff/$number',
  })
  return (
    <h2>
      {pageTitle} diff - {number}
    </h2>
  )
}

/**
 * Page diff route
 */
export const Route = createFileRoute('/pages/$pageTitle/diff/$number')({
  component: PageDiff,
})
