import './App.css'

/**
 * App component
 *
 * @returns JSX element
 */
export const App: React.FC = (): JSX.Element => {
  return (
    <>
      <header>
        <h1>swiki</h1>
      </header>
      <main>
        <section>
          <article>
            <p>
              &ldquo;swiki&rdquo;(&ldquo;s&rdquo; means &ldquo;solo&rdquo; or &ldquo;single&rdquo;)
              is a personal wiki application that runs in your browser without an internet
              connection and stores data locally.
            </p>

            <h2>CAUTION</h2>
            <p>
              swiki uses localStorage to store data. LocalStorage is a not persistent storage, the
              browser will delete data if you do not use for a while.
            </p>
          </article>
        </section>
      </main>
    </>
  )
}
