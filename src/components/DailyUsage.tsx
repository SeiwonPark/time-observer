import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'

import { COLORS } from '../styles/colors'
import { sortByTimeSpent, formatTime, getDomainNameFromUrl } from '../utils'

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

const Card = styled.li<{ isCurrent?: boolean }>`
  margin: 8px 4px;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: ${(props) => (props.isCurrent ? COLORS.box_shadow03 : COLORS.box_shadow01)};

  &:hover {
    box-shadow: ${COLORS.box_shadow02};
  }
`

const Pad2 = styled.div`
  padding: 2px;
`

export default function DailyUsage() {
  const [currentDomain, setCurrentDomain] = useState<string>()
  const [storageData, setStorageData] = useState<StorageData>({})

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url) {
        setCurrentDomain(getDomainNameFromUrl(tabs[0].url))
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.local.get(null, (result) => {
      setStorageData(result)
    })

    const onChange = (_: { [key: string]: chrome.storage.StorageChange }) => {
      chrome.storage.local.get(null, (result) => {
        setStorageData(result)
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
    <Margin4>
      <div>Current domain: {currentDomain}</div>
      <CardList>
        {sortedStorageData.map(([key, value]) => (
          <Card key={key} isCurrent={key === currentDomain}>
            <img src={value.favicon} alt="favicon" width="24" />
            <Pad2>{key}</Pad2>
            <Pad2>{formatTime(value.timeSpent)}</Pad2>
          </Card>
        ))}
      </CardList>
    </Margin4>
  )
}
