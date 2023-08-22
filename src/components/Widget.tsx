import React from 'react'

import styled from 'styled-components'

const Container = styled.div<{ backgroundColor: string }>`
  width: 140px;
  padding: 16px;
  border-radius: 16px;
  background-color: ${(props) => props.backgroundColor};
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

const Title = styled.span`
  padding: 8px;
  font-size: 16px;
`

const Content = styled.div`
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
`

const SmallUnit = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: #888888;
  margin: 0 4px 0 1px;
`

interface WidgetProps {
  Icon: SVGProps
  title: string
  content: string | number
  backgroundColor: string
  unit: WidgetUnit
}

export default function Widget({ Icon, title, content, backgroundColor, unit }: WidgetProps) {
  const formatContent = () => {
    if (unit === 'percent') {
      return (
        <>
          {content}
          <SmallUnit>%</SmallUnit>
        </>
      )
    } else if (unit === 'time') {
      let totalSeconds = Number(content)
      const hours = ~~(totalSeconds / 3600)
      totalSeconds %= 3600
      const minutes = ~~(totalSeconds / 60)
      return (
        <>
          {hours}
          <SmallUnit>h</SmallUnit>
          {minutes}
          <SmallUnit>m</SmallUnit>
        </>
      )
    }
  }

  return (
    <Container backgroundColor={backgroundColor}>
      <TitleContainer>
        <Icon width={18} height={18} />
        <Title>{title}</Title>
      </TitleContainer>
      <Content>{formatContent()}</Content>
    </Container>
  )
}
