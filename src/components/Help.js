import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Article = styled.article`
  position: relative;
  margin: 12px 0;
`
const Label = styled.span`
  display: inline-block;
  padding: 0 4px;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
  vertical-align: bottom;
  background-color: ${props => props.theme.blue};
`

class Help extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.docs = [
      { label: 'blog', content: '                   Front-end development thoughts' },
      { label: 'about', content: '                  About me' },
      { label: 'theme ls', content: '               List all the themes' },
      { label: 'theme use <name>', content: '       Change theme to theme' },
      { label: 'clear', content: '                  Clear command history' }
    ]
  }

  render () {
    return this.docs.map(({ label, content }, index) => {
      return (
        <Article key={index}>
          <Label theme={this.props.theme}>{label}</Label>
          <span dangerouslySetInnerHTML={{ __html: content.replace(/ /g, '&nbsp;') }}/>
        </Article>
      )
    })
  }
}

export default Help
