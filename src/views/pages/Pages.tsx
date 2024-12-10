import ArticleIcon from '@mui/icons-material/Article'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, css } from '@mui/material'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { pageListAtom } from '../../states/pages/atoms'
import { useMoveTo } from '../adapters/hooks'
import { formatPageUpdateInfo, getLanguage, getTitleToDisplay } from '../i18n'
import { Section } from '../templates/Section'
import { getSpecifiedPageBrowsePath } from '../utils'

/**
 * Single row component
 * @param param Param
 * @param param.children Children
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

/**
 * Page list component
 * @returns JSX Element
 */
export const Pages: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const moveTo = useMoveTo()

  const pages = useAtomValue(pageListAtom).map(({ type, page, updateCount }) => ({
    title: getTitleToDisplay(type, page?.title ?? null),
    language: getLanguage(page?.language ?? null),
    path: getSpecifiedPageBrowsePath(type, page?.title ?? null),
    updateInfo:
      page !== null
        ? formatPageUpdateInfo(i18n.language, dayjs(page?.dateAndTime), updateCount as number)
        : '-',
  }))

  return (
    <Section>
      <h2 lang={i18n.language}>{t('Pages')}</h2>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {pages.map(({ path, title, language, updateInfo }) => (
          <ListItemButton
            key={title}
            onClick={() => {
              moveTo(path)
            }}
          >
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
        ))}
      </List>
    </Section>
  )
}
