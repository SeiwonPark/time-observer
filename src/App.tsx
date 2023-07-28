import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS } from './styles/colors'

const Margin4 = styled.div`
  margin: 4px;
`
const Container = styled.div`
  width: 500px;
  height: 500px;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`
const Card = styled.li`
  margin: 8px 4px;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: ${COLORS.box_shadow01};
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
  }, [])

  return (
    <Container>
      <Margin4>
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
      </Margin4>
    </Container>
  )
}
