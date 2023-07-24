import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 500px;
  height: 500px;
`

export default function App() {
  const [currentURL, setCurrentURL] = useState<string>()
  const [youtube, setYoutube] = useState<number>(0)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url)
    })
  }, [])

  useEffect(() => {
    // FIXME: this only tracks www.youtube.com
    chrome.storage.local.get(['www.youtube.com'], function (result) {
      console.log(result)
      setYoutube(result['www.youtube.com'] || 0)
    })
  }, [youtube])

  return (
    <Container>
      <ul>
        <li>Current URL: {currentURL}</li>
        <li>Time spent on YouTube: {youtube} seconds</li>
      </ul>
    </Container>
  )
}
