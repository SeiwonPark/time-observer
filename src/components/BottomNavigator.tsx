import React from 'react'

import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import IconAlertFill from '../assets/alert_fill.svg'
import IconAlertOutline from '../assets/alert_outline.svg'
import IconCalendarOutline from '../assets/calendar_outline.svg'
import IconCalendarFill from '../assets/calender_fill.svg'
import IconTimeOutline from '../assets/time-outline.svg'
import IconTimeFill from '../assets/time_fill.svg'
import { COLORS } from '../styles/colors'

const Nav = styled.nav`
  width: calc(100% - 14px);
  height: 60px;
  bottom: 16px;
  left: 0;
  display: flex;
  position: fixed;
  border-radius: 12px;
  background-color: ${COLORS.black};
  align-items: center;
  justify-content: space-around;
`

const StyledNavLink = styled(NavLink)`
  padding: 1em;
  text-decoration: none;
`
export default function BottomNavigator() {
  const location = useLocation()

  return (
    <Nav>
      <StyledNavLink to="/">{location.pathname === '/' ? <IconTimeFill /> : <IconTimeOutline />}</StyledNavLink>
      <StyledNavLink to="/notification">
        {location.pathname === '/notification' ? <IconAlertFill /> : <IconAlertOutline />}
      </StyledNavLink>
      <StyledNavLink to="/settings">
        {location.pathname === '/settings' ? <IconCalendarFill /> : <IconCalendarOutline />}
      </StyledNavLink>
    </Nav>
  )
}
