import { css } from '@emotion/react'

const CSS_FAB_CONTAINER = css({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'fixed',
  bottom: 'var(--gap-unit)',
  left: 'var(--gap-unit)',
  right: 'var(--gap-unit)',
})

type Props = React.ComponentProps<'div'>

/**
 * Fab container component
 * @param props Props
 * @param props.children Fab
 * @returns JSX Element
 */
export const FabContainer: React.FC<Props> = ({ children }): JSX.Element => (
  <div css={CSS_FAB_CONTAINER}>{children}</div>
)
