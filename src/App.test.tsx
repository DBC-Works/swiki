import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it } from 'vitest'
import { App } from './App'

describe('App component', () => {
  const AppProvider: React.FC = () => <App />

  const setup = () => {
    userEvent.setup()
    return render(<AppProvider />)
  }

  it('should have the heading application title', () => {
    // arrange
    setup()

    // act
    screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
  })
})
