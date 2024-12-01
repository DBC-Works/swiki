import { css } from '@emotion/react'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import { Button } from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

const CSS = css({
  display: 'flex',
  gap: 'var(--gap-unit)',
  padding: 'var(--gap-unit) 0',
})

type Props = {
  okButtonDisabled: boolean
  onClickCancel: MouseEventHandler<HTMLButtonElement>
  onClickOK: MouseEventHandler<HTMLButtonElement>
}

/**
 * Modal operation buttons bar
 * @param props Props
 * @param prop.okButtonDisabled OK button disabled flag
 * @param prop.onClickCancel Cancel button click event handler
 * @param prop.onClickOK OK button click event handler
 * @returns JSX Element
 */
export const ModalOperationButtonsBar: React.FC<Props> = ({
  okButtonDisabled,
  onClickCancel,
  onClickOK,
}): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div css={CSS}>
      <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClickCancel}>
        {t('Cancel')}
      </Button>
      <Button
        variant="contained"
        startIcon={<DoneIcon />}
        disabled={okButtonDisabled}
        onClick={onClickOK}
      >
        {t('OK')}
      </Button>
    </div>
  )
}
