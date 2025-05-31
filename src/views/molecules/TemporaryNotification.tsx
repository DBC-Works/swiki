import { Snackbar } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  clearTemporaryNotificationAtom,
  getTemporaryNotificationAtom,
} from '../../states/interactions/atoms'

/**
 * Temporary notification component
 * @returns JSX Element
 */
export const TemporaryNotification: React.FC = (): JSX.Element => {
  const notification = useAtomValue(getTemporaryNotificationAtom)
  const clearNotification = useSetAtom(clearTemporaryNotificationAtom)
  setTimeout(() => {
    clearNotification()
  }, 2000)

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={0 < notification.length}
      message={notification}
    />
  )
}
