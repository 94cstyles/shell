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
const List = styled.ul`
  margin-left: 16px;
  font-size: 12px;
  list-style: circle;
`
const Item = styled.li`
  position: relative;
  padding-right: 90px;
  color: ${props => props.theme.white}
`
const Title = styled.a`
  display: inline-block;
  max-width: 100%;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  text-decoration: none;
  color: ${props => props.theme.white};
`
const Time = styled.span`
  position: absolute;
  top: 0;
  right: 0;
`
const More = styled.a`
  margin-left: 14px;
  font-size: 12px;
  color: ${props => props.theme.magenta};
`

class Blog extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    autoScroll: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      repo: '94cstyles/shell',
      loading: false,
      articles: []
    }
  }

  componentWillMount () {
    // 因为接口限制 每5分钟更新数据
    let cache = localStorage.getItem('articles')
    if (cache) {
      cache = JSON.parse(cache)
      if (Date.now() - cache.create <= 60000 * 5) {
        this.setState({ articles: cache.data }, this.props.autoScroll)
      } else {
        this.loadData()
      }
    } else {
      this.loadData()
    }
  }

  loadData () {
    const { autoScroll } = this.props
    this.setState({ loading: true }, autoScroll)
    fetch(`https://api.github.com/repos/${this.state.repo}/issues`)
      .then((response) => response.json())
      .then((data) => {
        const articles = data.map((item) => ({
          id: item.id,
          title: item.title,
          url: item.html_url,
          time: item.created_at.substring(0, 10)
        }))
        localStorage.setItem('articles', JSON.stringify({ create: Date.now(), data: articles }))
        this.setState({ loading: false, articles }, autoScroll)
      })
      .catch(() => (this.setState({ loading: false }, autoScroll)))
  }

  renderItem = ({ url, title, time }, index) => {
    return (
      <Item key={index}>
        <Title target='_blank' href={url} theme={this.props.theme}>{title}</Title>
        <Time>{time}</Time>
      </Item>
    )
  }

  render () {
    const { loading, articles, repo } = this.state

    return (
      <Fragment>
        <Article>
          <List>
            {this.state.articles.map(this.renderItem)}
          </List>
          {
            !loading && articles.length === 30 ? (
              <More target='_blank' href={`https://github.com/${repo}/issues`} theme={this.props.theme}>查看更多</More>
            ) : null
          }
        </Article>
        {
          loading ? (
            <Article>
              <Loading>...</Loading>
            </Article>
          ) : articles.length === 0 ? (
            <Article>cstyles很懒，没有留下任何足迹。</Article>
          ) : null
        }
      </Fragment>
    )
  }
}

export default Blog
