import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationDialog } from './ConfirmationDialog'

type Props = React.ComponentProps<'dialog'> & {
  onClickOK: MouseEventHandler<HTMLButtonElement>
  onClickCancel: MouseEventHandler<HTMLButtonElement>
}

/**
 * Discard confirmation dialog component
 * @param props Props
 * @param props.onClickOK OK button click event handler
 * @param props.onClickCancel Cancel button click event handler
 * @returns JSX Element
 */
export const DiscardConfirmationDialog: React.FC<Props> = ({
  onClickOK,
  onClickCancel,
}): JSX.Element => {
  const { t } = useTranslation()
  return (
    <ConfirmationDialog onClickCancel={onClickCancel} onClickOK={onClickOK}>
      {t('Are you sure you want to discard your edits?')}
    </ConfirmationDialog>
  )
}
