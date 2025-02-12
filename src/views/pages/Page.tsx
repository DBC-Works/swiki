import DifferenceIcon from '@mui/icons-material/Difference'
import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type PageData, PathTypes } from '../../states/pages/types'
import type { NonEmptyArray } from '../../types'
import { useMoveTo, useRouterParams } from '../adapters/hooks'
import { Revision } from '../atoms/Revision'
import { Time } from '../atoms/Time'
import { useExtraSmallWidth, usePageWithSpecifiedTitle } from '../hooks/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { PageUpdateInfo } from '../molecules/PageUpdateInfo'
import { Page as PageTemplate } from '../templates/Page'

type ComparisonPageSelectMenuItemProps = {
  escapedPageTitle: string
  targetRevision: number
  selectRevision: number
}

const ComparisonPageSelectMenuItem: React.FC<ComparisonPageSelectMenuItemProps> = ({
  escapedPageTitle,
  targetRevision,
  selectRevision,
}): JSX.Element => {
  const moveTo = useMoveTo()
  const handleClick = useCallback(() => {
    const to = selectRevision < targetRevision ? targetRevision : selectRevision
    const from = selectRevision < targetRevision ? selectRevision : targetRevision
    moveTo(`/pages/${escapedPageTitle}/diff/${to}/${from}`)
  }, [moveTo, escapedPageTitle, selectRevision, targetRevision])

  return (
    <MenuItem onClick={handleClick}>
      <Revision>{`${selectRevision}`}</Revision>
    </MenuItem>
  )
}

type ComparisonPageSelectProps = {
  escapedPageTitle: string
  index: number
  updateCount: number
  label: string
  selectWidth: number
}

const ComparisonPageSelect: React.FC<ComparisonPageSelectProps> = ({
  escapedPageTitle,
  label,
  selectWidth,
  index,
  updateCount,
}): JSX.Element => {
  const xs = useExtraSmallWidth()
  const labelId = `history-select-${index}`
  const labelLiteral = xs ? <DifferenceIcon /> : label

  return (
    <FormControl size="small">
      <InputLabel id={labelId}>{labelLiteral}</InputLabel>
      <Select labelId={labelId} label={label} sx={{ width: `${selectWidth}em` }}>
        {Array.from({ length: updateCount }, (_, i) => i)
          .filter((i) => i !== index)
          .map((i) => (
            <ComparisonPageSelectMenuItem
              key={`${labelId}-menu-item-${i}`}
              escapedPageTitle={escapedPageTitle}
              targetRevision={updateCount - index}
              selectRevision={updateCount - i}
            />
          ))}
      </Select>
    </FormControl>
  )
}

type PageHistoryProps = {
  escapedPageTitle: string
  pageDataHistory: NonEmptyArray<PageData>
}

const PageHistory: React.FC<PageHistoryProps> = ({
  escapedPageTitle,
  pageDataHistory,
}): JSX.Element => {
  const xs = useExtraSmallWidth()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleToggle = useCallback(() => {
    setOpen((open) => !open)
  }, [])
  const updateCount = pageDataHistory.length
  const label = t('Compare with...')
  const selectWidth = xs ? 4.5 : label.length
  const listItemTextStyle = { marginRight: `${selectWidth - 1.5}em` }

  return (
    <details open={open} onToggle={handleToggle}>
      <summary>
        <Typography component="span" color="textSecondary">
          <PageUpdateInfo updateCount={updateCount} dateTime={pageDataHistory[0].dateAndTime} />
        </Typography>
      </summary>
      {open !== false && (
        <List sx={{ width: '100%' }}>
          {pageDataHistory.map(({ language, title, dateAndTime }, index) => (
            <ListItem
              key={dateAndTime}
              secondaryAction={
                1 < pageDataHistory.length && (
                  <ComparisonPageSelect
                    escapedPageTitle={escapedPageTitle}
                    label={label}
                    selectWidth={selectWidth}
                    index={index}
                    updateCount={pageDataHistory.length}
                  />
                )
              }
            >
              <ListItemText secondary={title} lang={language} sx={listItemTextStyle}>
                <Typography component="span" color="textSecondary">
                  <Revision>{`${updateCount - index}`}</Revision>:
                  <Time dateTime={dateAndTime} />
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </details>
  )
}

/**
 * Page component
 * @returns JSX Element
 */
export const Page: React.FC = (): JSX.Element | null => {
  const { pageTitle } = useRouterParams({ from: '/pages/$pageTitle/' })
  const moveTo = useMoveTo()
  const title = decodeURIComponent(pageTitle)
  const page = usePageWithSpecifiedTitle(title)
  const latestPageData = page?.pageDataHistory[0] ?? null

  useEffect(() => {
    if (!latestPageData) {
      moveTo(PathTypes.Pages)
    }
  }, [latestPageData, moveTo])

  if (!latestPageData) {
    return null
  }

  const { language, content } = latestPageData as PageData

  return (
    <PageTemplate pageTitle={title}>
      <PageContentViewer lang={language} pageTitle={title}>
        {content}
      </PageContentViewer>
      <PageHistory
        escapedPageTitle={pageTitle}
        pageDataHistory={page?.pageDataHistory as NonEmptyArray<PageData>}
      />
    </PageTemplate>
  )
}
