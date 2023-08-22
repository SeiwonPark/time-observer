import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { COLORS } from '../styles/colors'
import { formatDate, sortByTimeSpent, formatTime, getDomainNameFromUrl } from '../utils'

const Margin4 = styled.div`
  margin: 4px;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(3, 33%);
  grid-template-rows: repeat(3, auto);
`

const Tooltip = styled.div`
  position: absolute;
  background-color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 999;
  pointer-events: none;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  color: ${COLORS.green};
  opacity: 0.9;
`

const Card = styled.li<{ isCurrent?: boolean }>`
  position: relative;
  margin: 8px 4px;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: ${(props) => (props.isCurrent ? COLORS.box_shadow03 : COLORS.box_shadow01)};
  cursor: pointer;

  &:hover {
    box-shadow: ${COLORS.box_shadow02};
  }
`

const Domain = styled.span`
  text-align: center;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Pad2 = styled.div`
  padding: 2px;
`

export default function DailyUsage() {
  const [currentDomain, setCurrentDomain] = useState<string>()
  const [storageData, setStorageData] = useState<DailyStorageList>({})
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null)
  const today = useMemo(() => formatDate(), [])
  const navigate = useNavigate()

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url) {
        setCurrentDomain(getDomainNameFromUrl(tabs[0].url))
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.local.get(null, (result: WeeklyStorageData) => {
      const dailyData = result[today]
      if (dailyData) {
        setStorageData(dailyData)
      }
    })

    const onChange = (_: { [key: string]: chrome.storage.StorageChange }) => {
      chrome.storage.local.get(null, (result: WeeklyStorageData) => {
        const dailyData = result[today]
        if (dailyData) {
          setStorageData(dailyData)
        }
      })
    }
    chrome.storage.onChanged.addListener(onChange)

    return () => {
      chrome.storage.onChanged.removeListener(onChange)
    }
  }, [])

  const handleMouseEnter = (content: string, event: React.MouseEvent) => {
    setTooltip({
      content,
      x: event.clientX + 60,
      y: event.clientY + 40,
    })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip((prev) => ({
        ...prev!,
        x: event.clientX + 60,
        y: event.clientY + 40,
      }))
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const sortStorageData = useCallback(sortByTimeSpent, [])
  const sortedStorageData = Object.entries(storageData).sort(sortStorageData)

  return (
    <Margin4>
      <div>Current domain: {currentDomain}</div>
      <CardList>
        {sortedStorageData.map(([key, value]) => (
          <Card
            key={key}
            isCurrent={key === currentDomain}
            onClick={() => navigate(key, { state: today })}
            onMouseEnter={(e) => handleMouseEnter(key, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img src={value.favicon} alt="favicon" width="24" />
            <Domain>{key}</Domain>
            <Pad2>{formatTime(value.timeSpent)}</Pad2>
          </Card>
        ))}
        {tooltip && <Tooltip style={{ top: tooltip.y, left: tooltip.x }}>{tooltip.content}</Tooltip>}
      </CardList>
    </Margin4>
  )
}
