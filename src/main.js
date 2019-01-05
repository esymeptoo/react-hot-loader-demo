import React from 'react'
import { render } from 'react-dom'
import AppContainer from '@/containers/AppContainer.jsx'

render(
  <AppContainer />,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept()
}
