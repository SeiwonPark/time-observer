import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import IconStopWatch from '../assets/stopwatch.svg'
import { COLORS } from '../styles/colors'
import { formatDate, sortByTimeSpent, formatTime, getDomainNameFromUrl } from '../utils'

const Margin4 = styled.div`
  margin: 4px;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
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
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  border-radius: 12px;
  background-color: ${COLORS.white};
  cursor: pointer;
`
const CardRight = styled.div`
  padding-left: 12px;
`

const Domain = styled.span`
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 36px;
`

const Pad2 = styled.div`
  padding: 2px;
`
const Pad12 = styled.div`
  padding: 12px;
`
const TimeSpent = styled.span`
  font-size: 12px;
  vertical-align: middle;
  line-height: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;
`
const GrayBack = styled.div`
  background-color: ${COLORS.background};
  border-radius: 6px;
  padding: 2px 8px;
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
            <Pad12>
              <img src={value.favicon} alt="favicon" width="24" height="24" />
            </Pad12>
            <CardRight>
              <Domain>{key}</Domain>
              <GrayBack>
                <TimeSpent>
                  <IconStopWatch />
                  <Pad2>{formatTime(value.timeSpent)}</Pad2>
                </TimeSpent>
              </GrayBack>
            </CardRight>
          </Card>
        ))}
        {tooltip && <Tooltip style={{ top: tooltip.y, left: tooltip.x }}>{tooltip.content}</Tooltip>}
      </CardList>
    </Margin4>
  )
}
