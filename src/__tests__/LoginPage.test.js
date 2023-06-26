import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import LoginPage from '../LoginPage'

// Mock out all top level functions, such as get, put, delete and post:
// jest.mock('axios')
afterEach(cleanup)

describe('LoginPage', () => {
  test('renders Login Page', () => {
    const root = renderer.create(<LoginPage />).toJSON()
    expect(root).toMatchSnapshot()
  })
})
