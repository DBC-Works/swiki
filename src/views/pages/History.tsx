import { Button, css } from '@mui/material'
import { type } from 'arktype'
import dayjs from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { clearProcessingAtom, inProcessingAtom, setProcessingAtom } from '../../states/edit/atoms'
import { setTemporaryNotificationAtom } from '../../states/interactions/atoms'
import { mergeImportPageDataAtom } from '../../states/pages/atoms'
import { VersionedPageList } from '../../states/pages/types'
import { AddPageFab } from '../atoms/AddPageFab'
import { getUploadText } from '../functions/utilities'
import { SortOrderTypes, useClickInput, useExportDataBlob, useSortedPages } from '../hooks/hooks'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { ReportDialog } from '../organisms/ReportDialog'
import { Section } from '../templates/Section'

const CSS_INPUT_FILE = css({
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
})

const ImportButton: React.FC = (): JSX.Element => {
  const inProcessing = useAtomValue(inProcessingAtom)
  const setProcessing = useSetAtom(setProcessingAtom)
  const mergeImportPageData = useSetAtom(mergeImportPageDataAtom)
  const clearProcessing = useSetAtom(clearProcessingAtom)
  const setTemporaryNotification = useSetAtom(setTemporaryNotificationAtom)
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [reportMessage, setReportMessage] = useState('')

  const handleClickImport = useCallback(() => useClickInput(fileInputRef), [])
  const handleClickReportDialogClose = useCallback(() => setReportMessage(''), [])
  const handleChangeFile = useCallback(async () => {
    if (!fileInputRef.current) {
      return
    }

    let valid = true
    try {
      const parsed = VersionedPageList(
        JSON.parse(await getUploadText(fileInputRef.current?.files as FileList)),
      )
      if (parsed instanceof type.errors) {
        console.error(parsed.summary)
        valid = false
      } else {
        setProcessing()
        await mergeImportPageData(parsed)
        setTemporaryNotification(t('Imported'))
        clearProcessing()
      }
    } catch (e) {
      console.error(e)
      valid = false
    }
    if (valid === false) {
      setReportMessage(t('The format of the specified file is not supported.'))
      return
    }
  }, [clearProcessing, mergeImportPageData, setProcessing, setTemporaryNotification, t])

  return (
    <>
      <input
        data-testid="upload-file"
        type="file"
        tabIndex={-1}
        accept=".json,application/json"
        css={CSS_INPUT_FILE}
        ref={fileInputRef}
        onChange={handleChangeFile}
      />
      <Button variant="outlined" disabled={inProcessing} onClick={handleClickImport}>
        {t('Import')}
      </Button>
      {0 < reportMessage.length && (
        <ReportDialog onClickClose={handleClickReportDialogClose}>{reportMessage}</ReportDialog>
      )}
    </>
  )
}

const CSS_DOWNLOAD_BUTTON_WRAPPER = css({ display: 'flex', flexDirection: 'column' })

const ExportAndDownloadButton: React.FC = (): JSX.Element => {
  const inProcessing = useAtomValue(inProcessingAtom)
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null)
  const { t } = useTranslation()
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
        disabled={exportDataUrl !== null || inProcessing}
        onClick={handleOnClick}
      >
        {t('Export')}
      </Button>
      <Button
        variant="outlined"
        css={css({ marginTop: '-2.275rem', visibility: exportDataUrl ? 'visible' : 'hidden' })}
        href={exportDataUrl ?? '#'}
        disabled={inProcessing}
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
        <ImportButton />
        <ExportAndDownloadButton />
      </div>
      <PageInfoList pages={pages} />
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
