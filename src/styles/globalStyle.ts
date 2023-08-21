/**
 * This is the global style for overall view of chrome extension.
 * Any styles for `body`, `font`, ... could be set from this.
 */
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  
  @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Rubik', sans-serif;
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
