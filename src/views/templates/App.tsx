import { useTranslation } from 'react-i18next'

import { GlobalStyles } from '../GlobalStyles'
import { TopAppBar } from '../organisms/TopAppBar'

type Props = React.ComponentProps<'main'>

/**
 * App template component
 * @param props Props
 * @param props.children Children
 * @returns JSX Element
 */
export const App: React.FC<Props> = ({ children }): JSX.Element => {
  const { i18n } = useTranslation()

  return (
    <div lang={i18n.language}>
      <GlobalStyles />
      <TopAppBar />
      <main>{children}</main>
    </div>
  )
}
