import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { latestPagesAtom } from '../../states/pages/atoms'
import { type PageData, PathTypes } from '../../states/pages/types'
import { useMoveTo, useRouterParams } from '../adapters/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { Page as PageTemplate } from '../templates/Page'

/**
 * Page component
 * @returns JSX Element
 */
export const Page: React.FC = (): JSX.Element | null => {
  const { pageTitle } = useRouterParams({ from: '/pages/$pageTitle/' })
  const latestPages = useAtomValue(latestPagesAtom)
  const moveTo = useMoveTo()
  const title = decodeURIComponent(pageTitle)
  const pageData = latestPages.find((page) => page?.title === title)

  useEffect(() => {
    if (!pageData) {
      moveTo(PathTypes.Pages)
    }
  }, [moveTo, pageData])

  if (!pageData) {
    return null
  }

  const { language, content } = pageData as PageData

  return (
    <PageTemplate pageTitle={title}>
      <PageContentViewer lang={language} pageTitle={title}>
        {content}
      </PageContentViewer>
    </PageTemplate>
  )
}
