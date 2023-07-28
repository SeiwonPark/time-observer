import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 500px;
  height: 500px;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const Card = styled.li`
  margin: 2px 2px;
  padding: 1em;
  border: 1px solid #cacaca;
  border-radius: 8px;
`

export default function App() {
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
    <Container>
      <div>Current URL: {currentURL}</div>
      <div>Time spent:</div>
      <CardList>
        {Object.entries(storageData).map(([key, value]) => (
          <Card key={key}>
            <img src={value.favicon} alt="favicon" width="30" />
            {key}: {value.timeSpent} seconds
          </Card>
        ))}
      </CardList>
    </Container>
  )
}
