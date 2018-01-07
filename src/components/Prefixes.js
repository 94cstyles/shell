import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

class Prefixes extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired
  }

  render () {
    const { theme } = this.props

    return (
      <Fragment>
        <span style={{ color: theme.red }}>guest</span>
        <span >@</span>
        <span style={{ color: theme.green }}>cstyles.sh</span>
        <span >:</span>
        <span style={{ color: theme.blue }}>/home/guest</span>
        <span style={{ color: theme.yellow }}>&nbsp;$&nbsp;</span>
      </Fragment>
    )
  }
}

export default Prefixes
