import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

/**
 * Root route
 */
export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <h1>swiki</h1>
        <div>
          <Link to="/">Home</Link> <Link to="/pages">Pages</Link> <Link to="/history">History</Link>
        </div>
      </header>
      <hr />
      <main>
        <section>
          <Outlet />
        </section>
      </main>
    </>
  ),
})
