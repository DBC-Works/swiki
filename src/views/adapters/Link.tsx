import {
  type FileRouteTypes,
  type LinkProps,
  Link as TanStackRouterLink,
} from '@tanstack/react-router'

type Props = React.ComponentProps<'span'> & {
  to: FileRouteTypes['to']
}

/**
 * Router library's link adapter component
 * @param props Props
 * @param props.to Destination
 * @param props.children Children
 * @returns JSX Element
 */
export const Link: React.FC<Props> = ({ to, children }) => {
  const props = {
    to,
  } as const satisfies LinkProps

  return <TanStackRouterLink {...props}>{children}</TanStackRouterLink>
}
