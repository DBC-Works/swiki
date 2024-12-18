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
  component: NewPageRoute,
})
