import { EditFab } from '../atoms/EditFab'
import { FabContainer } from '../organisms/FabContainer'
import { Section } from '../templates/Section'

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
  <Section>
    {children}
    <FabContainer>
      <EditFab pageTitle={pageTitle} returnPath={returnPath} />
    </FabContainer>
  </Section>
)
