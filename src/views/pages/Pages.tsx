import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { pageListAtom } from '../../states/pages/atoms'
import { AddPageFab } from '../atoms/AddPageFab'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

/**
 * Page list component
 * @returns JSX Element
 */
export const Pages: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const pages = useAtomValue(pageListAtom)

  return (
    <Section>
      <h2 lang={i18n.language}>{t('Pages')}</h2>
      <PageInfoList pages={pages} />
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
