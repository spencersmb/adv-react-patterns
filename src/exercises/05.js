// prop collections

import React from 'react'
import {Switch} from '../switch'

class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
      // In our last usage example, you'll notice that we had some
      // common props (`onClick`, and we're also missing `aria-expanded`
      // value on the `button`). Because most users will want these
      // props applied to the button they render, we can add a collection
      // of props as a convenience for them.
      //
      // Add a `togglerProps` object that has an `aria-expanded` (should
      // be set to the value of the `on` state), and an `onClick` assigned
      // to the toggle function.
    })
  }
}

function Usage(props) {
  return (
    <Toggle onToggle={props.onToggle}>
      {({on, togglerProps}) => (
        <div>
          <Switch on={on} {...togglerProps} />
          <hr />
          <button aria-label="custom-button" {...togglerProps}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}

export {Toggle, Usage}