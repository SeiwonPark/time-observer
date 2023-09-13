/**
 * This component is a general-purpose button component that can be customize.
 */
import React, { ReactNode } from 'react'
import { CSSProperties } from 'react'

import styled from 'styled-components'

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>

const Container = styled.button<{ $textColor?: string; $bgColor?: string; $fontSize?: string }>`
  color: ${(props) => props.$textColor || '#43454e'};
  background-color: ${(props) => props.$bgColor || '#f4f7fa'};
  font-size: ${(props) => props.$fontSize || '16px'};
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
`

interface ButtonProps {
  children?: ReactNode
  fontSize?: string
  textColor?: string
  bgColor?: string
  onClick: (event: ButtonClickEvent) => void
}

export const Button = ({ children, fontSize, textColor, bgColor, onClick }: ButtonProps) => {
  return (
    <Container type="button" onClick={onClick} $fontSize={fontSize} $textColor={textColor} $bgColor={bgColor}>
      {children}
    </Container>
  )
}
