import ArticleIcon from '@mui/icons-material/Article'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, css } from '@mui/material'
import { useCallback } from 'react'

import type { PageInfoForList } from '../../states/pages/types'
import { useMoveTo } from '../adapters/hooks'
import { getLanguage, getTitleToDisplay } from '../i18n'
import { PageUpdateInfo } from '../molecules/PageUpdateInfo'
import { getSpecifiedPageBrowsePath } from '../utils'

/**
 * Single row component
 * @param props Props
 * @param props.children Children
 * @returns JSX Element
 */
const SingleRowText: React.FC<React.ComponentProps<'span'>> = ({ children }) => {
  const CSS = css({
    display: 'inline-block',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  })

  return <span css={CSS}>{children}</span>
}

type PageInfoListRowProps = PageInfoForList

/**
 * Page info list row component
 * @param props Props
 * @param props.type Page type
 * @param props.page Page data
 * @param props.updateCount Update count
 * @returns JSX Element
 */
const PageInfoListRow: React.FC<PageInfoListRowProps> = ({
  type,
  page,
  updateCount,
}): JSX.Element => {
  const moveTo = useMoveTo()

  const title = getTitleToDisplay(type, page?.title ?? null)
  const language = getLanguage(page?.language ?? null)
  const path = getSpecifiedPageBrowsePath(type, page?.title ?? null)
  const updateInfo =
    page !== null ? (
      <PageUpdateInfo
        lang={language}
        dateTime={page?.dateAndTime}
        updateCount={updateCount as number}
      />
    ) : (
      '-'
    )

  const handleClick = useCallback(() => {
    moveTo(path)
  }, [moveTo, path])

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemAvatar>
        <Avatar>
          <ArticleIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        lang={language}
        primary={<SingleRowText>{title}</SingleRowText>}
        secondary={<SingleRowText>{updateInfo}</SingleRowText>}
      />
    </ListItemButton>
  )
}

type PageInfoListProps = {
  pages: PageInfoForList[]
}

/**
 * Page info list component
 * @param props Props
 * @param props.pages Array of page info for list
 * @returns JSX Element
 */
export const PageInfoList: React.FC<PageInfoListProps> = ({ pages }) => (
  <List sx={{ width: '100%' }}>
    {pages.map(({ type, page, updateCount }) => (
      <PageInfoListRow key={page?.title} type={type} page={page} updateCount={updateCount} />
    ))}
  </List>
)
