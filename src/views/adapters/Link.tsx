import {
  type LinkComponent,
  Link as TanStackRouterLink,
  type ToOptions,
} from '@tanstack/react-router'

export type ToPath = ToOptions['to'] | string

type Props = React.ComponentProps<LinkComponent<'a'>> & {
  to: NonNullable<ToPath>
  returnPath?: ToPath
}

/**
 * Router library's link adapter component
 * @param props Props
 * @param props.returnPath Return path
 * @param props.to Destination
 * @param props.children Children
 * @returns JSX Element
 */
export const Link: React.FC<Props> = ({ returnPath, to, children }) => (
  <TanStackRouterLink to={to} state={{ returnPath }}>
    {children}
  </TanStackRouterLink>
)
