import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

type Props = React.ComponentProps<'dialog'> & {
  onClickClose: MouseEventHandler<HTMLButtonElement>
}

/**
 * Report dialog
 * @param props Props
 * @param props.children Children
 * @param props.onClickClose Close button click event handler
 * @returns JSX Element
 */
export const ReportDialog: React.FC<Props> = ({ children, onClickClose }): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Dialog open={true} aria-describedby="report-dialog-description" onClose={onClickClose}>
      <DialogContent>
        <DialogContentText id="report-dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClickClose}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
