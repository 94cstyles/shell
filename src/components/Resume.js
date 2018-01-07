import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Article = styled.article`
  position: relative;
  margin: 12px 0;
`
const Loading = styled.span`
  display: inline-block;
  width: 0;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  vertical-align: bottom;
  animation: loading 1.2s step-end infinite;
`
const Label = styled.span`
  display: inline-block;
  padding: 0 4px;
  margin: 0 12px;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
  vertical-align: bottom;
  background-color: ${props => props.theme.red};
`
const List = styled.ul`
  margin: 6px 0 6px 32px;
  font-size: 12px;
`

class Resume extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    autoScroll: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      resume: []
    }
  }

  componentDidMount () {
    const time = this.generateTime()
    const resume = [
      { time, label: '姓名:', content: '文超' },
      { time, label: '年龄:', content: '23' },
      { time, label: '性别:', content: '男' },
      { time, label: '学校:', content: '华中科技大学' },
      { time, label: '邮箱:', content: 'cstyles@qq.com' },
      { time, label: 'Github:', content: 'https://github.com/94cstyles' }
    ]

    this.execTask(resume.map(this.createdTask)).then(() => (this.setState({ loading: false })))
  }

  generateTime () {
    const time = new Date()
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    let timeString = '' + hours
    timeString += (minutes < 10 ? ':0' : ':') + minutes
    timeString += (seconds < 10 ? ':0' : ':') + seconds
    return timeString
  }

  createdTask = (data) => {
    return () => new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ resume: this.state.resume.concat([data]) })
        this.props.autoScroll()
        resolve()
      }, 800 + Math.floor(Math.random() * 400))
    })
  }

  execTask (promises) {
    promises = promises.slice()

    return new Promise((resolve, reject) => {
      function next (result) {
        if (promises.length) {
          let promise = promises.shift()

          promise().then(next).catch(reject)
        } else {
          resolve()
        }
      }

      next()
    })
  }

  renderItem = ({ time, label, content, list }, index) => {
    return (
      <Article key={index}>
        <span>{time}</span>
        <Label theme={this.props.theme}>{label}</Label>
        {
          content ? (
            <span dangerouslySetInnerHTML={{ __html: content.replace(/ /g, '&nbsp;') }}/>
          ) : list ? (
            <List>
              {
                list.map((li) => {
                  return (
                    <li>
                      <span dangerouslySetInnerHTML={{ __html: li.content.replace(/ /g, '&nbsp;') }}/>
                    </li>
                  )
                })
              }
            </List>
          ) : null
        }
      </Article>
    )
  }

  render () {
    return (
      <Fragment>
        {this.state.resume.map(this.renderItem)}
        {
          this.state.loading ? (
            <Article>
              <Loading>...</Loading>
            </Article>
          ) : null
        }
      </Fragment>
    )
  }
}

export default Resume
