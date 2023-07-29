/**
 * This component defines global layout of each pages.
 */
import React, { ReactNode } from 'react'

import styled from 'styled-components'

const Container = styled.div`
  width: 500px;
  height: 500px;
`

export const Layout = ({ children }: { children?: ReactNode }) => {
  return <Container>{children}</Container>
}
