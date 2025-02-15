import { createFileRoute } from '@tanstack/react-router'

import { PageContentEditor } from '../views/pages/PageContentEditor'
import { PathTypes } from './../states/pages/types'

/**
 * NewPageRoute component
 * @returns JSX Element
 */
const NewPageRoute: React.FC = (): JSX.Element => <PageContentEditor />

/**
 * NewPage route
 */
export const Route = createFileRoute(PathTypes.NewPage)({
  validateSearch: (search: Record<string, unknown>): { title: string | undefined } => {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const title = search['title'] as string | undefined
    return {
      title,
    }
  },
  component: NewPageRoute,
})
