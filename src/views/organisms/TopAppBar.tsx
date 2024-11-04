import styled from '@emotion/styled'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import ListAltIcon from '@mui/icons-material/ListAlt'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Link } from '../adapters/Link'

const LinkContent = styled.span`
color: var(--AppBar-color);
`

const MenuItemIconContainer = styled(LinkContent)`
display: inline-block;
padding-top: 6px;
`

const MenuItem: React.FC<{
  to: string
  children: string
  icon: JSX.Element
}> = ({ children, icon, to }): JSX.Element => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))

  return sm ? (
    <Button variant="contained" disableElevation startIcon={icon}>
      <Link to={to}>
        <LinkContent>{children}</LinkContent>
      </Link>
    </Button>
  ) : (
    <IconButton aria-label={children}>
      <Link to={to}>
        <MenuItemIconContainer>{icon}</MenuItemIconContainer>
      </Link>
    </IconButton>
  )
}

/**
 * TopAppBar component
 * @returns JSX Element
 */
export const TopAppBar: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            swiki
          </Typography>
          <Box>
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
