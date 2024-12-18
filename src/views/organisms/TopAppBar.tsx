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
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { clearEditingInfoAtom, editingInfoAtom } from '../../states/edit/atoms'
import { PathTypes } from '../../states/pages/types'
import { useMoveTo } from '../adapters/hooks'
import { DiscardConfirmationDialog } from './DiscardConfirmationDialog'

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
  const moveTo = useMoveTo()
  const { editing } = useAtomValue(editingInfoAtom)
  const clearEditingInfo = useSetAtom(clearEditingInfoAtom)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClick = useCallback(() => {
    if (editing) {
      setShowConfirm(true)
    } else {
      moveTo(to)
    }
  }, [editing, moveTo, to])
  const handleClickConfirmOK = useCallback(() => {
    setShowConfirm(false)
    clearEditingInfo()
    moveTo(to)
  }, [clearEditingInfo, moveTo, to])
  const handleClickConfirmCancel = useCallback(() => {
    setShowConfirm(false)
  }, [])

  return (
    <>
      {sm ? (
        <Button variant="contained" disableElevation startIcon={icon} onClick={handleClick}>
          <span css={CSS_LINK_CONTAINER}>{children}</span>
        </Button>
      ) : (
        <IconButton aria-label={children} onClick={handleClick}>
          <span css={[CSS_LINK_CONTAINER, CSS_MENU_ITEM_ICON_CONTAINER]}>{icon}</span>
        </IconButton>
      )}
      {showConfirm && (
        <DiscardConfirmationDialog
          onClickCancel={handleClickConfirmCancel}
          onClickOK={handleClickConfirmOK}
        />
      )}
    </>
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
          <MenuItem to={PathTypes.FrontPage} icon={<HomeIcon />}>
            FrontPage
          </MenuItem>
          <MenuItem to={PathTypes.Pages} icon={<ListIcon />}>
            {t('Pages')}
          </MenuItem>
          <MenuItem to={PathTypes.History} icon={<ListAltIcon />}>
            History
          </MenuItem>
        </nav>
      </Toolbar>
    </AppBar>
  )
}
