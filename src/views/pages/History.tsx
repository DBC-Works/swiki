import { Button, css } from '@mui/material'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddPageFab } from '../atoms/AddPageFab'
import { SortOrderTypes, useExportDataBlob, useSortedPages } from '../hooks/hooks'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

const CSS_DOWNLOAD_BUTTON_WRAPPER = css({ display: 'flex', flexDirection: 'column' })

const ExportAndDownloadButton: React.FC = () => {
  const { t } = useTranslation()
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null)
  const blob = useExportDataBlob()
  useEffect(() => {
    return exportDataUrl !== null
      ? () => {
          setExportDataUrl(null)
          URL.revokeObjectURL(exportDataUrl)
        }
      : undefined
  }, [exportDataUrl])

  const handleOnClick = useCallback(() => {
    setExportDataUrl(URL.createObjectURL(blob))
  }, [blob])

  return (
    <div css={CSS_DOWNLOAD_BUTTON_WRAPPER}>
      <Button
        variant="outlined"
        css={css({ visibility: exportDataUrl ? 'hidden' : 'visible' })}
        disabled={exportDataUrl !== null}
        onClick={handleOnClick}
      >
        {t('Export')}
      </Button>
      <Button
        variant="outlined"
        css={css({ marginTop: '-2.275rem', visibility: exportDataUrl ? 'visible' : 'hidden' })}
        href={exportDataUrl ?? '#'}
        download={`swiki-page-data-${dayjs().format('YYYYMMDDTHHmm')}.json`}
      >
        {t('Download')}
      </Button>
    </div>
  )
}

const CSS_BUTTON_CONTAINER = css({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--gap-unit)',
})

/**
 * History component
 * @returns JSX Element
 */
export const History: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const pages = useSortedPages(SortOrderTypes.UpdateTimeDesc)

  return (
    <Section>
      <h2 lang={i18n.language}>{t('History')}</h2>
      <div css={CSS_BUTTON_CONTAINER}>
        <ExportAndDownloadButton />
      </div>
      <PageInfoList pages={pages} />
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
