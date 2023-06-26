import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import SignUpPage from '../Signuppage'

// Mock out all top level functions, such as get, put, delete and post:
// jest.mock('axios')
afterEach(cleanup)

describe('SignUpPage', () => {
  test('renders sign up form', () => {
    const root = renderer.create(<SignUpPage />).toJSON()
    expect(root).toMatchSnapshot()
  })

  it('handles form input changes', () => {
    const component = renderer.create(<SignUpPage />)
    const instance = component.root

    const firstNameInput = instance.findByProps({ placeholder: 'First Name' })
    firstNameInput.props.onChange({ target: { value: 'John' } })
    expect(
      instance.findByProps({ placeholder: 'First Name' }).props.value
    ).toBe('John')

    const lastNameInput = instance.findByProps({ placeholder: 'Last Name' })
    lastNameInput.props.onChange({ target: { value: 'Doe' } })
    expect(instance.findByProps({ placeholder: 'Last Name' }).props.value).toBe(
      'Doe'
    )

    const emailInput = instance.findByProps({ placeholder: 'Email' })
    emailInput.props.onChange({ target: { value: 'test@example.com' } })
    expect(instance.findByProps({ placeholder: 'Email' }).props.value).toBe(
      'test@example.com'
    )

    const mobileNoInput = instance.findByProps({ placeholder: 'Mobile No.' })
    mobileNoInput.props.onChange({ target: { value: '8828262521' } })
    expect(
      instance.findByProps({ placeholder: 'Mobile No.' }).props.value
    ).toBe('8828262521')

    const DesignationInput = instance.findByProps({
      placeholder: 'Designation Level'
    })
    DesignationInput.props.onChange({ target: { value: 'Level 5' } })
    expect(
      instance.findByProps({ placeholder: 'Designation Level' }).props.value
    ).toBe('Level 5')

    const passwordInput = instance.findByProps({
      placeholder: 'Password'
    })
    passwordInput.props.onChange({ target: { value: '1234' } })
    expect(instance.findByProps({ placeholder: 'Password' }).props.value).toBe(
      '1234'
    )

    const confirmPasswordInput = instance.findByProps({
      placeholder: 'Confirm Password'
    })
    confirmPasswordInput.props.onChange({ target: { value: '1234' } })
    expect(
      instance.findByProps({ placeholder: 'Confirm Password' }).props.value
    ).toBe('1234')
  })
  // test('handles sign up submission successfully', () => {
  //   const { getByPlaceholderText, getByText } = render(<SignUpPage />)

  //   const firstNameInput = getByPlaceholderText('First Name')
  //   const lastNameInput = getByPlaceholderText('Last Name')
  //   const emailInput = getByPlaceholderText('Email')
  //   const mobileNoInput = getByPlaceholderText('Mobile No.')
  //   const employeeLevelInput = getByPlaceholderText('Designation Level')
  //   const passwordInput = getByPlaceholderText('Password')
  //   const confirmPasswordInput = getByPlaceholderText('Confirm Password')
  //   const saveButton = getByText('Save')

  // fireEvent.change(firstNameInput, { target: { value: 'John' } })
  // fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
  // fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  // fireEvent.change(mobileNoInput, { target: { value: '1234567890' } })
  // fireEvent.change(employeeLevelInput, { target: { value: 'Manager's } })
  // fireEvent.change(passwordInput, { target: { value: 'password123' } })
  // fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

  // fireEvent.click(saveButton)
})
