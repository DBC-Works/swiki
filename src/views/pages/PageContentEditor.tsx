import { css } from '@emotion/react'
import { InputLabel, Tab, Tabs, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  type ChangeEvent,
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import type { ToPath } from '../adapters/Link'
import { useMoveTo, useReturnPath } from '../adapters/hooks'
import { ModalOperationButtonsBar } from '../molecules/ModalOperationButtonsBar'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { ConfirmationDialog } from '../organisms/ConfirmationDialog'
import { Section } from '../templates/Section'

const CSS_TITLE_EDITOR_CONTAINER = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--gap-unit)',
})

type TitleEditorProps = {
  pageTitle: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const TitleEditor: React.FC<TitleEditorProps> = ({ pageTitle, onChange }): JSX.Element => {
  const { t } = useTranslation()
  const [updated, setUpdated] = useState(false)
  const [title, setTitle] = useState(pageTitle)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (updated === false) {
        setUpdated(true)
      }
      setTitle(e.target.value)
      onChange(e)
    },
    [onChange, updated],
  )

  return (
    <div css={CSS_TITLE_EDITOR_CONTAINER}>
      <InputLabel htmlFor="page-title-text-field">{t('Title')}</InputLabel>
      <TextField
        id="page-title-text-field"
        required={true}
        sx={{ flexGrow: 1 }}
        value={title}
        error={updated !== false && title.length === 0}
        onChange={handleChange}
      />
    </div>
  )
}

const ContentEditorTabPanel: React.FC<React.ComponentProps<'div'> & { visible: boolean }> = ({
  visible,
  children,
}) => {
  const theme = useTheme()

  const CSS_TABPANEL = css({
    display: visible ? 'flex' : 'none',
    flexDirection: 'column',
    margin: 'calc(var(--gap-unit) / 2) 0 0',
    flexGrow: 1,
    ':has(> div)': {
      overflow: 'auto',
    },
    '> *': {
      display: 'flex',
      height: '1rem',
      flexGrow: 1,
      border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'}`,
      borderRadius: '4px',
    },
    '> *:first-of-type': {
      marginTop: 0,
    },
    '> textarea': {
      padding: '1rem',
      resize: 'none',
    },
    '> textarea:hover': {
      borderColor: 'currentColor',
    },
    '> textarea:focus': {
      margin: '0 1px',
      padding: '1rem calc(1rem - 1px)',
      borderColor: 'transparent',
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineRadius: '4px',
    },
    '> div > article': {
      width: '100%',
      padding: '1rem',
      overflow: 'auto',
    },
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

type ContentEditorProps = {
  pageContent: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const ContentEditor: React.FC<ContentEditorProps> = ({ pageContent, onChange }) => {
  const { t } = useTranslation()
  const [tabId, setTabId] = useState('source')
  const [content, setContent] = useState(pageContent)

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: string) => {
    setTabId(newValue)
  }, [])
  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value)
      onChange(e)
    },
    [onChange],
  )

  return (
    <div css={CSS_CONTENT_EDITOR_CONTAINER}>
      <Tabs value={tabId} onChange={handleChangeTab}>
        <Tab label={t('Source')} value="source" />
        <Tab label={t('Preview')} value="preview" />
      </Tabs>
      <ContentEditorTabPanel visible={tabId === 'source'}>
        <textarea value={content} onChange={handleChangeContent} />
      </ContentEditorTabPanel>
      <ContentEditorTabPanel visible={tabId === 'preview'}>
        <div>
          <PageContentViewer>{content}</PageContentViewer>
        </div>
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
  const returnPath = useReturnPath()
  const moveTo = useMoveTo()

  // TODO: Get page content from state
  const pageContent = '### page content'
  const [currentTitle, setCurrentTitle] = useState(pageTitle)
  const currentContent = useRef({ content: pageContent })
  const [editing, setEditing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const viewerPath: ToPath = returnPath || `/pages/${pageTitle}`

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value
      if (currentTitle !== title) {
        setCurrentTitle(title)
      }
      const updated = currentTitle !== title || currentContent.current.content !== pageContent
      if (updated !== editing) {
        setEditing(updated)
      }
    },
    [currentTitle, editing],
  )
  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value
      const updated = currentTitle !== pageTitle || currentContent.current.content !== content
      if (updated !== editing) {
        setEditing(updated)
      }
    },
    [currentTitle, editing, pageTitle],
  )

  const handleClickCancel = useCallback(() => {
    if (editing) {
      setShowConfirm(true)
    } else {
      moveTo(viewerPath)
    }
  }, [editing, moveTo, viewerPath])
  const handleClickOK = useCallback(() => {
    // TODO: Add page content update process
    moveTo(viewerPath)
  }, [moveTo, viewerPath])
  const handleClickConfirmOk = useCallback(() => {
    moveTo(viewerPath)
  }, [moveTo, viewerPath])
  const handleClickConfirmCancel = useCallback(() => {
    console.log('handleClickConfirmCancel')
    setShowConfirm(false)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (editing) {
        e.preventDefault()
        // @ts-ignore
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [editing])

  return (
    <Section css={CSS_SECTION} fitToContentArea={true}>
      <h2>
        {t('Source')} - {pageTitle}
        {editing && '('}
        {editing && <output>editing</output>}
        {editing && ')'}
      </h2>
      <TitleEditor pageTitle={pageTitle} onChange={handleChangeTitle} />
      <ContentEditor pageContent={pageContent} onChange={handleChangeContent} />
      <ModalOperationButtonsBar
        okButtonDisabled={currentTitle.length === 0}
        onClickCancel={handleClickCancel}
        onClickOK={handleClickOK}
      />
      {showConfirm && (
        <ConfirmationDialog
          onClickCancel={handleClickConfirmCancel}
          onClickOK={handleClickConfirmOk}
        >
          {t('Are you sure you want to discard your edits?')}
        </ConfirmationDialog>
      )}
    </Section>
  )
}
