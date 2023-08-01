import React from 'react'

import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { COLORS } from '../styles/colors'

const Nav = styled.nav`
  width: calc(100% - 14px);
  height: 60px;
  display: flex;
  position: fixed;
  background-color: ${COLORS.box_shadow01};
  align-items: center;
  justify-content: space-between;
`

const StyledNavLink = styled(NavLink)`
  padding: 1em;
  text-decoration: none;
`

export default function BottomNavigator() {
  return (
    <Nav>
      {/* FIXME: to icons */}
      <StyledNavLink to="/">Home</StyledNavLink>
      <StyledNavLink to="/notification">Notification</StyledNavLink>
      <StyledNavLink to="/settings">Settings</StyledNavLink>
    </Nav>
  )
}
