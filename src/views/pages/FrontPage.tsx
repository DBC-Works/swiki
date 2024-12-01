import { useFrontPagePresentation } from '../hooks/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { Page } from '../templates/Page'

/**
 * FrontPage component
 * @returns JSX Element
 */
export const FrontPage: React.FC = (): JSX.Element => {
  const { title, language, content } = useFrontPagePresentation()

  return (
    <Page pageTitle={title} returnPath="/">
      <PageContentViewer lang={language} pageTitle={title}>
        {content}
      </PageContentViewer>
    </Page>
  )
}
