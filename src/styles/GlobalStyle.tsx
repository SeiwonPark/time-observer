import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }

  /* Scrollbar Style */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e3e3e3;
    border-radius: 6px;
    border: 3px solid transparent;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #aaaaaa;
  }
`
