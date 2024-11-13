import { css } from '@emotion/react'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import ListAltIcon from '@mui/icons-material/ListAlt'
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Link } from '../adapters/Link'

const CSS_LINK_CONTAINER = css({
  color: 'var(--AppBar-color)',
})

const CSS_MENU_ITEM_ICON_CONTAINER = css({
  display: 'inline-block',
  paddingTop: '6px',
})

const MenuItem: React.FC<{
  to: string
  children: string
  icon: JSX.Element
}> = ({ children, icon, to }): JSX.Element => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Link to={to}>
      {sm ? (
        <Button variant="contained" disableElevation startIcon={icon}>
          <span css={CSS_LINK_CONTAINER}>{children}</span>
        </Button>
      ) : (
        <IconButton aria-label={children}>
          <span css={[CSS_LINK_CONTAINER, CSS_MENU_ITEM_ICON_CONTAINER]}>{icon}</span>
        </IconButton>
      )}
    </Link>
  )
}

/**
 * TopAppBar component
 * @returns JSX Element
 */
export const TopAppBar: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <AppBar position="static" sx={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          swiki
        </Typography>
        <nav>
          <MenuItem to="/" icon={<HomeIcon />}>
            FrontPage
          </MenuItem>
          <MenuItem to="/pages" icon={<ListIcon />}>
            {t('Pages')}
          </MenuItem>
          <MenuItem to="/history" icon={<ListAltIcon />}>
            History
          </MenuItem>
        </nav>
      </Toolbar>
    </AppBar>
  )
}
