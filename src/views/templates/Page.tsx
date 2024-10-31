import styled from '@emotion/styled'

type Props = React.ComponentProps<'section'>

const Section = styled.section`
  padding: 0 1rem;
`

/**
 * Page template component
 * @param props Props
 * @param props.children Children
 * @returns JSX element
 */
export const Page: React.FC<Props> = ({ children }) => <Section>{children}</Section>
