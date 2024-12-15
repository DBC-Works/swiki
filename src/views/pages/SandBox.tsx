import { PathTypes } from '../../states/pages/types'
import { useSandBoxPresentation } from '../hooks/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { Page } from '../templates/Page'

/**
 * SandBox component
 * @returns JSX Element
 */
export const SandBox: React.FC = (): JSX.Element => {
  const { title, language, content } = useSandBoxPresentation()

  return (
    <Page pageTitle={title} returnPath={PathTypes.SandBox}>
      <PageContentViewer lang={language} pageTitle={title}>
        {content}
      </PageContentViewer>
    </Page>
  )
}
