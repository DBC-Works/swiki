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
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { flattenPageListAtom } from '../../states/pages/atoms'
import { type PageData, PathTypes } from '../../states/pages/types'
import type { NonEmptyArray } from '../../types'
import { useMoveTo, useRouterParams } from '../adapters/hooks'
import { Time } from '../atoms/Time'
import { useExtraSmallWidth } from '../hooks/hooks'
import { PageContentViewer } from '../molecules/PageContentViewer'
import { PageUpdateInfo } from '../molecules/PageUpdateInfo'
import { Page as PageTemplate } from '../templates/Page'

type ComparisonPageSelectProps = {
  index: number
  updateCount: number
  label: string
  selectWidth: number
}

const ComparisonPageSelect: React.FC<ComparisonPageSelectProps> = ({
  index,
  updateCount,
  label,
  selectWidth,
}): JSX.Element => {
  const xs = useExtraSmallWidth()
  const { t } = useTranslation()
  const labelId = `history-select-${index}`
  const labelLiteral = xs ? <DifferenceIcon /> : label

  return (
    <FormControl size="small">
      <InputLabel id={labelId}>{labelLiteral}</InputLabel>
      <Select labelId={labelId} label={label} sx={{ width: `${selectWidth}em` }}>
        {Array.from({ length: updateCount }, (_, i) => i)
          .filter((i) => i !== index)
          .map((i) => (
            <MenuItem
              key={`${labelId}-menu-item-${i}`}
            >{`${t('Rev.')}${updateCount - i}`}</MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

type PageHistoryProps = {
  pageDataHistory: NonEmptyArray<PageData>
}

const PageHistory: React.FC<PageHistoryProps> = ({ pageDataHistory }): JSX.Element => {
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
                    index={index}
                    updateCount={pageDataHistory.length}
                    label={label}
                    selectWidth={selectWidth}
                  />
                )
              }
            >
              <ListItemText secondary={title} lang={language} sx={listItemTextStyle}>
                <Typography component="span" color="textSecondary">
                  {`${t('Rev.')}${updateCount - index}:`} <Time dateTime={dateAndTime} />
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
  const page = useAtomValue(flattenPageListAtom).find(
    ({ page }) => page?.pageDataHistory[0].title === title,
  )
  const latestPageData = page?.page?.pageDataHistory[0] ?? null

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
      <PageHistory pageDataHistory={page?.page?.pageDataHistory as NonEmptyArray<PageData>} />
    </PageTemplate>
  )
}
