import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
  pointer-events: none;
`

class ActivatePowerMode extends PureComponent {
  static propTypes = {
    offset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }

  static defaultProps = {
    offset: { x: 0, y: 0 }
  }

  constructor (props) {
    super(props)

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  componentDidMount () {
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.particlePointer = 0
    this.requestID = requestAnimationFrame(this.step)

    document.body.addEventListener('input', this.handleInput)
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.requestID)
    document.body.addEventListener('input', this.handleInput)
    window.removeEventListener('resize', this.handleResize)
  }

  step = () => {
    if (this.particles.length > 0) {
      this.ctx.clearRect(0, 0, this.state.width, this.state.height)
      let particle
      for (let i = this.particles.length - 1; i >= 0; i--) {
        particle = this.particles[i]

        if (particle.alpha <= 0.1) continue

        particle.velocity.y += 0.075
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y
        particle.alpha *= 0.96
        this.ctx.globalAlpha = particle.alpha
        this.ctx.fillStyle = particle.color
        this.ctx.fillRect(
          Math.round(particle.x - 1.5),
          Math.round(particle.y - 1.5),
          3, 3
        )
      }
    }

    this.requestID = requestAnimationFrame(this.step)
  }

  getCaret (el) {
    const rect = el.getBoundingClientRect()
    const u = this.getRandom(0, 360)
    const { x, y } = this.props.offset

    return {
      x: rect.left + x,
      y: rect.top + y,
      color: 'hsla(' + this.getRandom(u - 10, u + 10) + ', 100%, ' + this.getRandom(50, 80) + '%, ' + 1 + ')'
    }
  }

  getRandom (min, max) {
    return Math.random() * (max - min) + min
  }

  handleInput = (event) => {
    const caret = this.getCaret(event.target)
    let numParticles = 5 + Math.round(Math.random() * 10)
    while (numParticles--) {
      // 随机生成粒子信息
      this.particles[this.particlePointer] = {
        x: caret.x,
        y: caret.y,
        alpha: 1,
        color: caret.color,
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      }
      // 限制粒子数量
      this.particlePointer = (this.particlePointer + 1) % 500
    }
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  render () {
    return (
      <Canvas innerRef={ref => (this.canvas = ref)} width={this.state.width} height={this.state.height}/>
    )
  }
}

export default ActivatePowerMode
