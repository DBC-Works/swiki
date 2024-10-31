import { Page } from '../templates/Page'

/**
 * FrontPage component
 * @returns JSX Element
 */
export const FrontPage: React.FC = (): JSX.Element => (
  <Page>
    <article>
      <h2>FrontPage</h2>
      <p>
        &ldquo;swiki&rdquo;(&ldquo;s&rdquo; means &ldquo;solo&rdquo; or &ldquo;single&rdquo;) is a
        personal wiki application that runs in your browser without an internet connection and
        stores data locally.
      </p>

      <h3>CAUTION</h3>
      <p>
        swiki uses localStorage to store data. LocalStorage is a not persistent storage, the browser
        will delete data if you do not use for a while.
      </p>
    </article>
  </Page>
)
