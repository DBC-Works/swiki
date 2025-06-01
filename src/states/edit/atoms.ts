import { atom } from 'jotai'

import { editingInfo } from './states'

/**
 * Editing info atom
 */
export const editingInfoAtom = atom(editingInfo)

/**
 * Set editing info write-only atom
 */
export const setEditingInfoAtom = atom(null, (get, set, editing: boolean) => {
  set(editingInfoAtom, { ...get(editingInfoAtom), editing })
})

/**
 * Clear editing info write-only atom
 */
export const clearEditingInfoAtom = atom(null, (get, set) => {
  set(editingInfoAtom, { ...get(editingInfoAtom), editing: false })
})

/**
 * Get in processing read-only atom
 */
export const inProcessingAtom = atom((get) => get(editingInfoAtom).processing)

/**
 * Set in processing write-only atom
 */
export const setProcessingAtom = atom(null, (get, set) => {
  set(editingInfoAtom, { ...get(editingInfoAtom), processing: true })
})

/**
 * Clear in processing write-only atom
 */
export const clearProcessingAtom = atom(null, (get, set) => {
  set(editingInfoAtom, { ...get(editingInfoAtom), processing: false })
})
