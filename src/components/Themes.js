import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import themes from '../assets/data/themes'

const List = styled.ul`
  position: relative;
  margin: 12px 0 12px 16px;
`
const Item = styled.li`
  position: relative;
  margin: 12px 0;
`
const Active = styled.span`
  margin-left: 12px;,
  color:${props => props.theme.green}
`

class Themes extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    currentTheme: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.themeNames = Object.keys(themes)
  }

  renderItem = (key, index) => {
    return (
      <Item key={index}>
        {key}
        {
          key === this.props.currentTheme ? <Active theme={this.props.theme}>√</Active> : null
        }
      </Item>
    )
  }

  render () {
    return (
      <List>
        {this.themeNames.map(this.renderItem)}
      </List>
    )
  }
}

export default Themes
