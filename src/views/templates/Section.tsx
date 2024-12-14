import { css } from '@emotion/react'
import { Children, isValidElement } from 'react'

import { FabContainer } from '../organisms/FabContainer'

type Props = React.ComponentProps<'section'> & {
  fitToContentArea?: boolean
}

/**
 * Section component
 * @param props Props
 * @param props.children Children
 * @param props.fitToContentArea Fit to content area flag
 * @returns JSX Element
 */
export const Section: React.FC<Props> = ({ children, fitToContentArea, ...rest }) => {
  const childElements = Children.toArray(children)
  const hasFab = childElements.some((child) => isValidElement(child) && child.type === FabContainer)

  const sectionCss = css({
    padding: `var(--gap-unit) var(--gap-unit) ${hasFab ? '6rem' : 0}`,
    boxSizing: 'border-box',
    height: fitToContentArea ? '100%' : 'auto',
    'h2:first-of-type': {
      marginTop: 0,
    },
  })

  return (
    <section css={sectionCss} {...rest}>
      {children}
    </section>
  )
}
