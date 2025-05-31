import { css } from '@emotion/react'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { clearEditingInfoAtom, editingInfoAtom, inProcessingAtom } from '../../states/edit/atoms'
import { PathTypes } from '../../states/pages/types'
import { useMoveTo } from '../adapters/hooks'
import { useExtraSmallWidth } from '../hooks/hooks'
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
  const xs = useExtraSmallWidth()
  const moveTo = useMoveTo()
  const { editing, processing } = useAtomValue(editingInfoAtom)
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
      {xs ? (
        <IconButton aria-label={children} disabled={processing} onClick={handleClick}>
          <span css={[CSS_LINK_CONTAINER, CSS_MENU_ITEM_ICON_CONTAINER]}>{icon}</span>
        </IconButton>
      ) : (
        <Button
          variant="contained"
          disableElevation
          startIcon={icon}
          disabled={processing}
          onClick={handleClick}
        >
          <span css={CSS_LINK_CONTAINER}>{children}</span>
        </Button>
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
  const inProcessing = useAtomValue(inProcessingAtom)

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
      <LinearProgress css={{ visibility: inProcessing ? 'visible' : 'hidden' }} />
    </AppBar>
  )
}
