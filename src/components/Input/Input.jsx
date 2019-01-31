import React from 'react'
import PropTypes from 'prop-types'
import './style.less'

export default class Input extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  handleChange(e) {
    const { target: { value } } = e
    const { onChange } = this.props
    this.setState({
      value: value,
    })
    onChange(e)
  }

  render() {
    return <span className="esy-input-wrapper">
      <input className="esy-input" type="text" value={this.state.value} onChange={this.handleChange.bind(this)}/>
    </span>
  }
}
