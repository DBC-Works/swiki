import { atom } from 'jotai'
import { temporaryNotifications } from './states'

/**
 * Temporary notifications atom
 */
const temporaryNotificationsAtom = atom(temporaryNotifications)

/**
 * Get temporary notification read-only atom
 * @returns The first temporary notification or an empty string if none exist
 */
export const getTemporaryNotificationAtom = atom((get) => {
  const notifications = get(temporaryNotificationsAtom)
  return 0 < notifications.length ? notifications[0] : ''
})

/**
 * Set temporary notifications write-only atom
 */
export const setTemporaryNotificationAtom = atom(
  null,
  (get, set, notification: Exclude<string, ''>) => {
    set(temporaryNotificationsAtom, [...get(temporaryNotificationsAtom), notification])
  },
)

/**
 * Clear temporary notifications write-only atom
 */
export const clearTemporaryNotificationAtom = atom(null, (get, set) => {
  set(temporaryNotificationsAtom, get(temporaryNotificationsAtom).slice(1))
})
