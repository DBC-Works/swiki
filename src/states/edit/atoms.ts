import { atom } from 'jotai'
import { editingInfo } from './states'

/**
 * Editing info atom
 */
export const editingInfoAtom = atom(editingInfo)

/**
 * Set editing info write-only atom
 */
export const setEditingInfoAtom = atom(null, (_, set, editing: boolean) => {
  set(editingInfoAtom, { editing })
})

/**
 * Clear editing info write-only atom
 */
export const clearEditingInfoAtom = atom(null, (_, set) => {
  set(editingInfoAtom, { editing: false })
})
