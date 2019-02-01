import React from 'react'
import TestForm from '@/components/TestForm/TestForm'

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      counter: 1,
      formData: {
        name: 'zc',
      },
    }
  }

  handleClick() {
    this.setState({
      counter: this.state.counter + 1,
    })
  }

  handleFormChange(val) {
    this.setState({
      formData: {
        ...this.state.formData,
        ...val,
      }
    })
  }

  render() {
    return <div>
      hello world with counter11
      <p>{this.state.counter}</p>
      <button onClick={this.handleClick.bind(this)}>add</button>
      <div>
        <p>表单组件</p>
        <TestForm
          formData={this.state.formData}
          onValueChange={this.handleFormChange.bind(this)}
        />
      </div>
    </div>
  }
}
