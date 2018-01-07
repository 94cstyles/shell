import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Prefixes from '../components/Prefixes'
import Help from '../components/Help'
import Blog from '../components/Blog'
import Themes from '../components/Themes'
import Resume from '../components/Resume'
import themes from '../assets/data/themes'

const Container = styled.div`
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  width: 100%;
  height: 100%;
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.backgroundColor};
`
const Header = styled.header`
  position: relative;
  height: 34px;
`
const Dot = styled.ul`
  position: absolute;
  left: 6px;
  top: 0;
  display: flex;
  align-items: center;
  height: 34px;
`
const DotItem = styled.li`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 6px;
  border-radius: 6px;
  list-style: none;
  background-color: ${props => props.focus ? props.color : '#ccc'};
`
const Window = styled.section`
   -webkit-box-flex: 1;
   overflow-y: auto;
   ::-webkit-scrollbar {
    background-color: transparent;
   }
`
const Content = styled.div`
  padding: 0 20px;
  line-height: 24px;
  font-size: 13px;
  font-family: Monaco, Menlo, Consolas, monospace;
  word-break: break-all;
  color: ${props => props.theme.white}
`
const Title = styled.div`
  line-height: 1;
  font-size: 46px;
  font-style: italic;
  font-family: 'Bungee Outline', cursive;
`
const SubTitle = styled.span`
  font-size: 20px;
`
const Article = styled.article`
  position: relative;
  margin: 12px 0;
`
const Input = styled.input`
  width: 1px;
  background-color: transparent;
  border: 0 none;
  cursor: default;
  opacity: 0;
`
const Cursor = styled.span`
  margin-left: 1px;
  font-size: 12px;
  animation: blink 1s step-end infinite;
  background-color: ${props => props.theme.cursorColor}
`

class Terminal extends PureComponent {
  constructor (props) {
    super(props)

    const themeNames = Object.keys(themes)
    let currentTheme = themeNames[(new Date()).getDay()] // 每天1套主题

    this.state = {
      input: '',
      output: [],
      edit: false,
      focus: false,
      theme: themes[currentTheme],
      themeNames,
      currentTheme
    }

    this.commands = {
      help: () => (this.setState({ output: this.state.output.concat([{ template: 'help' }]) })),
      blog: () => (this.setState({ output: this.state.output.concat([{ template: 'blog' }]), edit: true })),
      about: () => (this.setState({ output: this.state.output.concat([{ template: 'about' }]), edit: true })),
      theme: (commands) => {
        const { output } = this.state
        if (commands[1] === 'ls') {
          this.setState({ output: output.concat([{ template: 'themes' }]) }, this.autoScroll)
        } else if (commands[1] === 'use') {
          if (this.state.themeNames.includes(commands[2])) {
            this.setState({ currentTheme: commands[2], theme: themes[commands[2]] })
          } else {
            this.setState({
              output: output.concat([{
                template: 'message',
                content: `theme: ${commands[2]} not in [ ${this.themeNames.join(', ')} ]`
              }])
            }, this.autoScroll)
          }
        } else {
          this.setState({
            output: output.concat([{
              template: 'message',
              content: `-bash: ${commands.join(' ')}: command not found`
            }])
          }, this.autoScroll)
        }
      },
      clear: () => {
        this.setState({ output: [] })
        this.autoScroll()
      }
    }
  }

  componentDidMount () {
    this.handleActive()
    const command = window.location.hash.replace(/^#/, '')
    if (Object.keys(this.commands).includes(command)) {
      setTimeout(() => this.emitCommand(command), 1000)
    }
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  emitCommand = (command) => {
    if (command.type === 'click') command = 'blog'
    this.setState({ input: command }, () => {
      this.handleKeyUp({ keyCode: 13, stopPropagation: () => false })
    })
  }

  autoScroll = () => {
    setTimeout(() => {
      if (this.window) {
        this.window.scrollTop = this.window.scrollHeight - this.window.clientHeight
      } else {
        this.autoScroll()
      }
    }, 0)
  }

  handleActive = () => {
    this.input.focus()
  }

  handleKeyDown = (event) => {
    if (/(3[789]|40)/.test(event.keyCode)) {
      event.preventDefault()
    }
  }

  handleKeyUp = (event) => {
    event.stopPropagation()

    if ((event.ctrlKey && event.keyCode === 67) || event.keyCode === 13) {
      const { input, output, focus, edit } = this.state
      if (edit && event.keyCode === 13) return
      if (!edit) output.push({ template: 'command', content: input })

      const commands = input.trim().split(' ')
      if (event.keyCode === 13 && commands[0] !== '' && focus) {
        const method = this.commands[commands[0]]
        if (method) {
          this.input.value = ''
          this.setState({ input: '' })
          return method(commands)
        } else {
          output.push({ template: 'message', content: `-bash: ${commands[0]}: command not found` })
        }
      } else if (edit) {
        output.pop()
      }

      this.input.value = ''
      this.setState({ output: [].concat(output), input: '', edit: false }, () => {
        this.handleActive()
        this.autoScroll()
      })
    } else {
      this.autoScroll()
    }
  }

  handleTouchUp = () => {
    this.tapTerminal = false
  }

  handleTouchDown = () => {
    this.tapTerminal = true
  }

  handleFocus = () => {
    if (!this.tapTerminal) this.setState({ focus: true })
  }

  handleBlur = () => {
    if (!this.tapTerminal) this.setState({ focus: false })
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value })
  }

  renderContent = ({ template, content }, index) => {
    const { theme, currentTheme } = this.state
    if (template === 'help') {
      return <Help key={index} theme={theme}/>
    } else if (template === 'blog') {
      return <Blog key={index} theme={theme} autoScroll={this.autoScroll}/>
    } else if (template === 'themes') {
      return <Themes key={index} theme={theme} currentTheme={currentTheme}/>
    } else if (template === 'about') {
      return <Resume key={index} theme={theme} autoScroll={this.autoScroll}/>
    } else if (/command|message/.test(template)) {
      return (
        <Article key={index}>
          {template === 'message' ? null : <Prefixes theme={theme}/>}
          {content}
        </Article>
      )
    } else {
      return null
    }
  }

  render () {
    const { theme, focus, edit } = this.state

    return (
      <Container
        theme={theme}
        onTouchStart={this.handleTouchDown}
        onMouseDown={this.handleTouchDown}
        onTouchEnd={this.handleTouchUp}
        onMouseUp={this.handleTouchUp}
        onClick={this.handleActive}>
        <Header>
          <Dot>
            <DotItem focus={focus} color='#ff554e'/>
            <DotItem focus={focus} color='#ffb429'/>
            <DotItem focus={focus} color='#25c439'/>
          </Dot>
        </Header>
        <Window innerRef={ref => (this.window = ref)}>
          <Content theme={theme}>
            <Title>
              CSTYLES<SubTitle> . SHELL</SubTitle>
            </Title>
            <Article style={{ color: theme.cyan }}>
              "Everything we hear is a opinion, not a fact. Everything we see is a perspective, not the truth."
            </Article>
            <Article style={{ color: theme.cyan }}>
              View the blog in the&nbsp;
              <a href='#blog' style={{ color: theme.cyan }} onClick={this.emitCommand}>blog</a>
              &nbsp;folder.
            </Article>
            <Article style={{ color: theme.cyan }}>
              - <a href='mailto:cstyles@qq.com' style={{ color: theme.magenta }}>&lt;cstyles@qq.com&gt;</a>
            </Article>
            <Article>
              Type<span style={{ color: theme.yellow }}> `help` </span> fro a list of commands
            </Article>
            {this.state.output.map(this.renderContent)}
            <Article style={{ display: edit ? 'none' : 'block' }}>
              <Prefixes theme={theme}/>
              <span>{this.state.input}</span>
              <Cursor theme={theme}>&nbsp;</Cursor>
              <Input
                innerRef={ref => (this.input = ref)}
                type='text'
                disabled={edit}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}/>
            </Article>
          </Content>
        </Window>
      </Container>
    )
  }
}

export default Terminal
