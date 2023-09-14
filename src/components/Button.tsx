/**
 * This component is a general-purpose button component that can be customize.
 */
import React, { ReactNode } from 'react'

import styled from 'styled-components'

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>

const Container = styled.button<{ $textColor?: string; $bgColor?: string; $fontSize?: string; $borderColor?: string }>`
  color: ${(props) => props.$textColor || '#43454e'};
  background-color: ${(props) => props.$bgColor || '#f4f7fa'};
  font-size: ${(props) => props.$fontSize || '16px'};
  line-height: ${(props) => props.$fontSize || '16px'};
  border: 2px solid ${(props) => props.$borderColor || '#43454e'};
  border-radius: 8px;
  padding: 0px;
  vertical-align: middle;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 2px;
  height: fit-content;
  cursor: pointer;
`

interface ButtonProps {
  children?: ReactNode
  fontSize?: string
  textColor?: string
  bgColor?: string
  borderColor?: string
  onClick: (event: ButtonClickEvent) => void
}

export const Button = ({ children, fontSize, textColor, bgColor, borderColor, onClick }: ButtonProps) => {
  return (
    <Container
      type="button"
      onClick={onClick}
      $fontSize={fontSize}
      $textColor={textColor}
      $borderColor={borderColor}
      $bgColor={bgColor}
    >
      {children}
    </Container>
  )
}
