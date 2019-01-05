import React from 'react'

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      counter: 1,
    }
  }

  handleClick() {
    this.setState({
      counter: ++this.state.counter,
    })
  }

  render() {
    return <div>
      hello world with counter1222
      <p>{this.state.counter}</p>
      <button onClick={this.handleClick.bind(this)}>add</button>
    </div>
  }
}
