import { css } from '@emotion/react'
import { InputLabel, Tab, Tabs, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  type ChangeEvent,
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { clearEditingInfoAtom, editingInfoAtom, setEditingInfoAtom } from '../../states/edit/atoms'
import { addPageDataAtom } from '../../states/pages/atoms'
import { type PageEditSource, PageTypes, PathTypes } from '../../states/pages/types'
import type { ToPath } from '../adapters/Link'
import { useMoveTo, useReturnPath } from '../adapters/hooks'
import { usePageEditSource, useUsableTitle } from '../hooks/hooks'
import { ModalOperationButtonsBar } from '../molecules/ModalOperationButtonsBar'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { DiscardConfirmationDialog } from '../organisms/DiscardConfirmationDialog'
import { Section } from '../templates/Section'
import { getPageBrowsePath } from '../utils'

const ID_TEXT_FIELD_TITLE = 'page-title-text-field'
const ID_TEXT_AREA_CONTENT = 'page-content-text-area'

const CSS_TITLE_EDITOR_CONTAINER = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--gap-unit)',
})

type TitleEditorProps = {
  lang: string
  title: string
  isTitleUsable: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
}

const TitleEditor: React.FC<TitleEditorProps> = ({
  lang,
  title,
  isTitleUsable,
  onChange,
}): JSX.Element => {
  const { t } = useTranslation()
  const [updated, setUpdated] = useState(false)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (updated === false) {
        setUpdated(true)
      }
      onChange(e)
    },
    [onChange, updated],
  )

  return (
    <div css={CSS_TITLE_EDITOR_CONTAINER}>
      <InputLabel lang={lang} htmlFor={ID_TEXT_FIELD_TITLE}>
        {t('Title')}
      </InputLabel>
      <TextField
        id={ID_TEXT_FIELD_TITLE}
        required={true}
        lang={lang}
        sx={{ flexGrow: 1 }}
        value={title}
        error={isTitleUsable === false}
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
  lang: string
  pageContent: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

const ContentEditor: React.FC<ContentEditorProps> = ({ lang, pageContent, onChange }) => {
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
        <textarea
          id={ID_TEXT_AREA_CONTENT}
          lang={lang}
          value={content}
          onChange={handleChangeContent}
        />
      </ContentEditorTabPanel>
      <ContentEditorTabPanel visible={tabId === 'preview'}>
        <div>
          <PageContentViewer lang={lang}>{content}</PageContentViewer>
        </div>
      </ContentEditorTabPanel>
    </div>
  )
}

type EditPageHeadingProps = { pageTitle: string; editing: boolean }

const EditPageHeading: React.FC<EditPageHeadingProps> = ({ pageTitle, editing }) => {
  const { t } = useTranslation()
  return (
    <>
      {t('Source')} - {pageTitle}
      {editing && '('}
      {editing && (
        <output htmlFor={`${ID_TEXT_FIELD_TITLE} ${ID_TEXT_AREA_CONTENT}`}>editing</output>
      )}
      {editing && ')'}
    </>
  )
}

const getPagePresentationInfo = (pageEditSource: PageEditSource | null, language: string) => ({
  id: pageEditSource?.id,
  type: pageEditSource?.type ?? PageTypes.Content,
  language: pageEditSource?.pagePresentation?.language ?? language,
  content: pageEditSource?.pagePresentation?.content ?? '',
})

const CSS_SECTION = css({
  display: 'flex',
  flexDirection: 'column',
  button: {
    flex: 1,
  },
})

type Props = React.ComponentProps<typeof Section> & {
  pageTitle?: string
}

/**
 * PageContentEditor component
 * @param props Props
 * @param props.pageTitle Page title to edit
 * @returns JSX Element
 */
export const PageContentEditor: React.FC<Props> = ({ pageTitle }): JSX.Element => {
  const { t, i18n } = useTranslation()
  const moveTo = useMoveTo()
  const returnPath = useReturnPath()
  const addPageData = useSetAtom(addPageDataAtom)
  const clearEditingInfo = useSetAtom(clearEditingInfoAtom)
  const isEditMode = pageTitle ? 0 < pageTitle.length : false

  const pageEditSource = isEditMode ? usePageEditSource(pageTitle as string) : null
  const { id, type, language, content } = getPagePresentationInfo(pageEditSource, i18n.language)

  const { editing } = useAtomValue(editingInfoAtom)
  const setEditingInfo = useSetAtom(setEditingInfoAtom)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editingTitle, setEditingTitle] = useState(isEditMode ? (pageTitle as string) : '')
  const editingContent = useRef({ content })

  const isTitleUsable = useUsableTitle(pageTitle ?? '', editingTitle)
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

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      if (editingTitle !== value) {
        setEditingTitle(value)
        const updated = pageTitle !== value || editingContent.current.content !== content
        if (updated !== editing) {
          setEditingInfo(updated)
        }
      }
    },
    [content, editing, editingTitle, pageTitle, setEditingInfo],
  )
  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target
      if (editingContent.current.content !== value) {
        editingContent.current.content = value
        const updated = editingTitle !== pageTitle || editingContent.current.content !== content
        if (updated !== editing) {
          setEditingInfo(updated)
        }
      }
    },
    [content, editing, editingTitle, pageTitle, setEditingInfo],
  )

  const decidePath = (path: string) => {
    return isEditMode ? (returnPath ?? getPageBrowsePath(pageTitle as string)) : path
  }

  const sourcePath: ToPath = decidePath(PathTypes.Pages)
  const handleClickCancel = useCallback(() => {
    if (editing) {
      setShowConfirm(true)
    } else {
      moveTo(sourcePath)
    }
  }, [editing, moveTo, sourcePath])
  const handleClickConfirmOK = useCallback(() => {
    clearEditingInfo()
    setShowConfirm(false)
    moveTo(sourcePath)
  }, [clearEditingInfo, moveTo, sourcePath])
  const handleClickConfirmCancel = useCallback(() => {
    setShowConfirm(false)
  }, [])

  const pagePath: ToPath = returnPath ?? getPageBrowsePath(editingTitle)
  const handleClickOK = useCallback(() => {
    if (editing) {
      addPageData(
        type,
        id ?? crypto.randomUUID(),
        language,
        editingTitle,
        editingContent.current.content,
      )
      clearEditingInfo()
    }
    moveTo(pagePath)
  }, [addPageData, clearEditingInfo, editing, editingTitle, id, language, moveTo, pagePath, type])

  return (
    <Section css={CSS_SECTION} fitToContentArea={true}>
      <h2>
        {isEditMode ? (
          <EditPageHeading pageTitle={pageTitle as string} editing={editing} />
        ) : (
          t('New page')
        )}
      </h2>
      <TitleEditor
        lang={language}
        title={editingTitle}
        isTitleUsable={isTitleUsable || (isEditMode === false && editingTitle.length === 0)}
        onChange={handleChangeTitle}
      />
      <ContentEditor lang={language} pageContent={content} onChange={handleChangeContent} />
      <ModalOperationButtonsBar
        okButtonDisabled={isTitleUsable === false}
        onClickCancel={handleClickCancel}
        onClickOK={handleClickOK}
      />
      {showConfirm && (
        <DiscardConfirmationDialog
          onClickCancel={handleClickConfirmCancel}
          onClickOK={handleClickConfirmOK}
        />
      )}
    </Section>
  )
}
