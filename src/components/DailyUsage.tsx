import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import IconStopWatch from '../assets/stopwatch.svg'
import { COLORS } from '../styles/colors'
import { formatDate, sortByTimeSpent, formatTime, getDomainNameFromUrl } from '../utils'

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const Card = styled.li`
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

const BlackCard = styled.div`
  background-color: ${COLORS.black};
  color: ${COLORS.white};
  border-radius: 12px;
  padding: 24px 20px;
`

const CurrentDomain = styled.div`
  font-size: 16px;
`

const CurrentTime = styled.div`
  font-size: 32px;
  font-weight: 500;
`

const Domain = styled.div`
  font-weight: 500;
  font-size: 14px;
  width: 240px;
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
const GrayBack = styled.div`
  background-color: ${COLORS.background};
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
`
const TimeSpent = styled.span`
  font-size: 12px;
  vertical-align: middle;
  line-height: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;
`
const Spacer = styled.div`
  width: 100%;
  height: 60px;
`
export default function DailyUsage() {
  const [currentDomain, setCurrentDomain] = useState<string>()
  const [storageData, setStorageData] = useState<DailyStorageList>({})
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

  const sortStorageData = useCallback(sortByTimeSpent, [])
  const sortedStorageData = Object.entries(storageData).sort(sortStorageData)

  return (
    <>
      <BlackCard>
        <CurrentTime>{currentDomain ? formatTime(storageData[currentDomain]?.timeSpent) : 0}</CurrentTime>
        <CurrentDomain>{currentDomain}</CurrentDomain>
      </BlackCard>

      <h2>Today</h2>
      <CardList>
        {sortedStorageData.map(([key, value]) => (
          <Card key={key} onClick={() => navigate(key, { state: today })}>
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
      </CardList>
      <Spacer />
    </>
  )
}
