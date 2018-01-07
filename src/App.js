import React, { Component } from 'react'
import styled from 'styled-components'
import ActivatePowerMode from './components/ActivatePowerMode'
import Terminal from './components/Terminal'
import computer from './assets/computer.svg'

const Container = styled.div`
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%202%202%22%3E%3Cpath%20d%3D%22M1%202V0h1v1H0v1z%22%20fill-opacity%3D%22.05%22%2F%3E%3C%2Fsvg%3E");
  background-size: 16px 16px;
`
const Computer = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 1024px) {
    display: none; 
  }
`
const Panel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 830px;
  height: 554px;
  margin-top: -16px;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 1024px) {
    width: 100%;
    height: 100%;
    margin-top: 0;
  }
`

class App extends Component {
  render () {
    return (
      <Container>
        <Computer src={computer}/>
        <Panel>
          <Terminal/>
        </Panel>
        <ActivatePowerMode offset={{ x: -6, y: 0 }}/>
      </Container>
    )
  }
}

export default App
