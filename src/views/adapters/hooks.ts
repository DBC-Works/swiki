import { useNavigate, useParams, useRouterState, useSearch } from '@tanstack/react-router'

import type { ToPath } from './Link'

export const useRouterParams = useParams

/**
 * Get return path from history state
 * @returns Return path
 */
export const useReturnPath = (): string | undefined => {
  // https://github.com/TanStack/router/discussions/1342
  const { returnPath } = useRouterState({ select: (s) => s.location.state })
  return returnPath
}

/**
 * Get move to specified path function
 * @returns Move to specified path function
 */
export const useMoveTo = (): ((to: NonNullable<ToPath>, title?: string) => void) => {
  const navigate = useNavigate()
  return (to, title?) => {
    navigate({ to, search: { title: title ? encodeURIComponent(title) : undefined } })
  }
}

/**
 * Get search parameters
 * @returns Search parameters
 */
export const useSearchParams = (): { title?: string } =>
  useSearch({
    strict: false,
  })
