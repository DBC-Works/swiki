import { createFileRoute, useParams } from '@tanstack/react-router'

import { PageDiff } from '../../../../../views/pages/PageDiff'

/**
 * Diff component
 * @returns JSX Element
 */
const Diff: React.FC = (): JSX.Element => {
  const { pageTitle, from, to } = useParams({
    from: '/pages/$pageTitle/diff/$to/$from',
  })

  return <PageDiff pageTitle={pageTitle} from={from} to={to} />
}

/**
 * Page diff route
 */
export const Route = createFileRoute('/pages/$pageTitle/diff/$to/$from')({
  component: Diff,
})
