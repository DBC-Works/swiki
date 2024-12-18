import { useNavigate, useParams, useRouterState } from '@tanstack/react-router'

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
export const useMoveTo = (): ((to: NonNullable<ToPath>) => void) => {
  const navigate = useNavigate()
  return (to) => {
    navigate({ to })
  }
}
