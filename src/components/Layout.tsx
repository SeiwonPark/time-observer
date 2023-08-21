/**
 * This component defines common layout of each page.
 */
import React, { ReactNode } from 'react'

import styled from 'styled-components'

import { GlobalStyle } from '../styles/globalStyle'
import BottomNavigator from './BottomNavigator'

const Container = styled.div`
  width: 375px;
  height: 100%;
  overflow: hidden;
`

const Content = styled.div`
  height: 620px;
  overflow-y: scroll;
`

const Spacer = styled.div`
  width: 100%;
  height: 60px;
`

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Content>{children}</Content>
        <BottomNavigator />
        <Spacer />
      </Container>
    </>
  )
}
