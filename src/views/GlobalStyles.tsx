import { Global, css } from '@emotion/react'

const globalStyles = css`
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

:root {
  --gap-unit: 1.5rem;
}

html,
body,
div#root {
  height: 100%;
}
body {
  margin: 0;
  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    "BIZ UDPGothic",
    Meiryo,
    sans-serif;
  padding: 0 0 env(safe-area-inset-bottom);
}
div#root {
  overflow: auto;
}
a {
  text-decoration-line: none;
}
`

/**
 * Global style definition component
 * @returns JSX.Element
 */
export const GlobalStyles: React.FC = (): JSX.Element => <Global styles={globalStyles} />
