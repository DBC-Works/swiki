import { css } from '@emotion/react'

import { EditFab } from '../atoms/EditFab'

const CSS_FAB_CONTAINER = css({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'fixed',
  bottom: 'var(--gap-unit)',
  left: 'var(--gap-unit)',
  right: 'var(--gap-unit)',
})

type Props = React.ComponentProps<'div'> & {
  pageTitle: string
  returnPath?: string | undefined
}

/**
 * Fab container component
 * @param props Props
 * @param props.pageTitle Page title to edit
 * @param props.returnPath Path to return
 * @returns JSX Element
 */
export const FabContainer: React.FC<Props> = ({ pageTitle, returnPath }): JSX.Element => (
  <div css={CSS_FAB_CONTAINER}>
    <EditFab pageTitle={pageTitle} returnPath={returnPath} />
  </div>
)
