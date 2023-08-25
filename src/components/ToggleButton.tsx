import React, { ChangeEvent } from 'react'

import styled from 'styled-components'

const Container = styled.div`
  padding-left: 8px;
`

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`
const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ebebeb;
  transition: 0.4s;
  border-radius: 30px;

  &::before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 50%;
  }
`

const Input = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider}::before {
    transform: translateX(23px);
    background-color: black;
  }
`

interface ToggleButtonProps {
  toggle: (checked: boolean) => void
}

export default function ToggleButton({ toggle }: ToggleButtonProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggle(e.target.checked)
  }

  return (
    <Container>
      <Switch>
        <Input onChange={handleChange} />
        <Slider />
      </Switch>
    </Container>
  )
}
