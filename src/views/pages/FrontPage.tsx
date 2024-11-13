import { useTranslation } from 'react-i18next'

import { PageContentViewer } from '../molecules/PageContentViewer'
import { Page } from '../templates/Page'

/**
 * FrontPage component
 * @returns JSX Element
 */
export const FrontPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const frontPageContent = t('initialFrontPage')

  // TODO: Determine title of latest FrontPage content
  return (
    <Page pageTitle="FrontPage" returnPath="/">
      <PageContentViewer>{frontPageContent}</PageContentViewer>
    </Page>
  )
}
