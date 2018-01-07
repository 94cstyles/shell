import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { injectGlobal } from 'styled-components'

injectGlobal`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
  }
  
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  @font-face {
    font-family: 'Bungee Outline';
    src: url('fonts/BungeeOutline-Regular.ttf')
  }
  
  @keyframes blink {
    50% {
      visibility: hidden;
    }
  }
  
  @keyframes loading {
    0% {
      width: 0;
    }
    25% {
      width: 5px;
    }
    50% {
      width: 15px;
    }
    75% {
      width: 25px;
    }
  }
`

ReactDOM.render(<App/>, document.getElementById('root'))
