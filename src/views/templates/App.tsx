import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'

import { GlobalStyles } from '../GlobalStyles'
import { TopAppBar } from '../organisms/TopAppBar'

const CSS_CONTAINER = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

const CSS_HEADER = css({
  flexGrow: 0,
})

const CSS_MAIN = css({
  flexGrow: 1,
})

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
    <div css={CSS_CONTAINER} lang={i18n.language}>
      <GlobalStyles />
      <div css={CSS_HEADER}>
        <TopAppBar />
      </div>
      <main css={CSS_MAIN}>{children}</main>
    </div>
  )
}
