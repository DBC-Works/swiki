import { css } from '@emotion/react'

import { FabContainer } from '../organisms/FabContainer'
import { Section } from '../templates/Section'

const CSS_SECTION = css({
  paddingBottom: '6rem',
})

type Props = React.ComponentProps<'section'> & {
  pageTitle: string
  returnPath?: string | undefined
}

/**
 * Page template component
 * @param props Props
 * @param props.pageTitle Page title
 * @param props.returnPath Return path
 * @param props.children Children
 * @returns JSX element
 */
export const Page: React.FC<Props> = ({ pageTitle, returnPath, children }) => (
  <Section css={CSS_SECTION}>
    {children}
    <FabContainer pageTitle={pageTitle} returnPath={returnPath} />
  </Section>
)
