import { createFileRoute } from '@tanstack/react-router'

import { SandBox } from '../views/pages/SandBox'

/**
 * SandBoxRoute component
 * @returns JSX Element
 */
const SandBoxRoute: React.FC = (): JSX.Element => <SandBox />

/**
 * SandBox route
 */
export const Route = createFileRoute('/SandBox')({
  component: SandBoxRoute,
})
