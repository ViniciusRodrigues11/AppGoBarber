import React from 'react';
import SignIn from '../../pages/SignIn'
import { render } from 'react-native-testing-library'

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn()
  }
})

describe('SignIn page', () => {
  it('shold contains email/password inputs', () => {
    const { getByPlaceholder } = render(<SignIn />)

    expect(getByPlaceholder('E-mail')).toBeTruthy()
    expect(getByPlaceholder('Senha')).toBeTruthy()
  })
})
