/**
 * This component defines common layout of each page.
 */
import React, { ReactNode } from 'react'

import styled from 'styled-components'

import { GlobalStyle } from '../styles/globalStyle'
import BottomNavigator from './BottomNavigator'

const Margin4 = styled.div`
  margin: 4px;
`

const Container = styled.div`
  width: 375px;
  margin: 16px;
`

const Content = styled.div`
  height: 508px;
`

const Spacer = styled.div`
  width: 100%;
  height: 60px;
`

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <Margin4>
      <GlobalStyle />
      <Container>
        <Content>{children}</Content>
        <BottomNavigator />
        <Spacer />
      </Container>
    </Margin4>
  )
}
