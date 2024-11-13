import { css } from '@emotion/react'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import { Button, Tab, Tabs, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useCallback, useState } from 'react'
import type { ToPath } from '../adapters/Link'
import { useMoveTo, useReturnPath } from '../adapters/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { Section } from '../templates/Section'

const CSS_TITLE_EDITOR_CONTAINER = css({
  display: 'flex',
  gap: '1.5rem',
  h3: { display: 'inline-block' },
})

const TitleEditor: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div css={CSS_TITLE_EDITOR_CONTAINER}>
      <h3>{t('Title')}</h3>
      <TextField required={true} sx={{ flexGrow: 1 }} />
    </div>
  )
}

const CSS_EDIT_BUTTON_CONTAINER = css({
  display: 'flex',
  gap: 'var(--gap-unit)',
  padding: 'var(--gap-unit) 0',
})

const EditorButtons: React.FC<{ pageTitle: string }> = (pageTitle): JSX.Element => {
  const { t } = useTranslation()
  const returnPath = useReturnPath()
  const moveTo = useMoveTo()

  // TODO: Add beforeunload event handler

  const viewerPath: ToPath = returnPath || `/pages/${pageTitle}`
  const handleClickCancel = useCallback(() => {
    // TODO: Show confirmation if updated
    moveTo(viewerPath)
  }, [moveTo, viewerPath])
  const handleClickOK = useCallback(() => {
    // TODO: Add page content update process
    moveTo(viewerPath)
  }, [moveTo, viewerPath])

  return (
    <div css={CSS_EDIT_BUTTON_CONTAINER}>
      <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleClickCancel}>
        {t('Cancel')}
      </Button>
      <Button variant="contained" startIcon={<DoneIcon />} onClick={handleClickOK}>
        {t('OK')}
      </Button>
    </div>
  )
}

const ContentEditorTabPanel: React.FC<React.ComponentProps<'div'> & { visible: boolean }> = ({
  visible,
  children,
}) => {
  const CSS_TABPANEL = css({
    display: visible ? 'flex' : 'none',
    flexDirection: 'column',
    margin: 'calc(var(--gap-unit) / 2) 0 0',
    flexGrow: 1,
    div: {
      flexGrow: 1,
    },
    height: '1rem',
    overflow: 'auto',
  })

  return (
    <div role="tabpanel" css={CSS_TABPANEL}>
      {children}
    </div>
  )
}

const CSS_CONTENT_EDITOR_CONTAINER = css({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginTop: 'calc(var(--gap-unit) / 2)',
})

const ContentEditor: React.FC = () => {
  const { t } = useTranslation()
  const [tabId, setTabId] = useState('source')

  // TODO: Add beforeunload event handler
  // TODO: Add preview function

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabId(newValue)
  }

  return (
    <div css={CSS_CONTENT_EDITOR_CONTAINER}>
      <Tabs value={tabId} onChange={handleChange}>
        <Tab label={t('Source')} value="source" />
        <Tab label={t('Preview')} value="preview" />
      </Tabs>
      <ContentEditorTabPanel visible={tabId === 'source'}>
        <TextField multiline />
      </ContentEditorTabPanel>
      <ContentEditorTabPanel visible={tabId === 'preview'}>
        <PageContentViewer>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </PageContentViewer>
      </ContentEditorTabPanel>
    </div>
  )
}

const CSS_SECTION = css({
  display: 'flex',
  flexDirection: 'column',
  button: {
    flex: 1,
  },
})

type Props = React.ComponentProps<typeof Section> & {
  pageTitle: string
}

/**
 * PageContentEditor component
 * @param props Props
 * @param props.pageTitle Page title to edit
 * @returns JSX Element
 */
export const PageContentEditor: React.FC<Props> = ({ pageTitle }): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Section css={CSS_SECTION} fitToContentArea={true}>
      <h2>
        {t('Source')} - {pageTitle}
      </h2>
      <TitleEditor />
      <ContentEditor />
      <EditorButtons pageTitle={pageTitle} />
    </Section>
  )
}
