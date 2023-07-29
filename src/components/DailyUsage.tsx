import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { COLORS } from '../styles/colors'

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

const Card = styled.li`
  margin: 8px 4px;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: ${COLORS.box_shadow01};

  &:hover {
    box-shadow: ${COLORS.box_shadow02};
  }
`

const Pad2 = styled.div`
  padding: 2px;
`

export default function DailyUsage() {
  const [currentURL, setCurrentURL] = useState<string>()
  const [storageData, setStorageData] = useState<StorageData>({})

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentURL(tabs[0].url)
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

  return (
    <Margin4>
      <div>Current URL: {currentURL}</div>
      <div>Time spent:</div>
      <CardList>
        {Object.entries(storageData).map(([key, value]) => (
          <Card key={key}>
            <img src={value.favicon} alt="favicon" width="30" />
            <Pad2>{key}</Pad2>
            <Pad2>{value.timeSpent} seconds</Pad2>
          </Card>
        ))}
      </CardList>
    </Margin4>
  )
}
