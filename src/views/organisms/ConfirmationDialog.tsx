import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

type Props = React.ComponentProps<'dialog'> & {
  onClickCancel: MouseEventHandler<HTMLButtonElement>
  onClickOK: MouseEventHandler<HTMLButtonElement>
}

/**
 * Confirmation dialog
 * @param props Props
 * @param props.children Children
 * @param props.onClickCancel Cancel button click event handler
 * @param props.onClickOK OK button click event handler
 * @returns JSX Element
 */
export const ConfirmationDialog: React.FC<Props> = ({
  children,
  onClickCancel,
  onClickOK,
}): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Dialog open={true} aria-describedby="confirmation-dialog-description" onClose={onClickCancel}>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel}>{t('Cancel')}</Button>
        <Button autoFocus onClick={onClickOK}>
          {t('OK')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
