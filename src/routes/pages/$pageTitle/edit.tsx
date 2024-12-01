import { createFileRoute, useParams } from '@tanstack/react-router'

import { PageContentEditor } from '../../../views/pages/PageContentEditor'

/**
 * Page edit component
 * @returns JSX element
 */
const PageEdit: React.FC = (): JSX.Element => {
  const { pageTitle } = useParams({ from: '/pages/$pageTitle/edit' })

  return <PageContentEditor pageTitle={pageTitle} />
}

/**
 * Page edit route
 */
export const Route = createFileRoute('/pages/$pageTitle/edit')({
  component: PageEdit,
})
