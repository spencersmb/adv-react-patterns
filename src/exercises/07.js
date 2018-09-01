// State Initializers

import React from 'react'
import { Switch } from '../switch'

const callAll = (...fns) => (...args) =>
	fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
	// 🐨 We're going to need some static defaultProps here to allow
	// people to pass a `initialOn` prop.
	static defaultProps = {
		initialOn: false
	}

	// 🐨 Rather than initializing state to have on as false,
	// we set a global Init State Prop to reference inside the component
	initialState = {on: this.props.initialOn}

	state = this.initialState

	// 🐨 now let's add a reset method here that resets the state
	// to the initial state. Then add a callback that calls
	// this.props.onReset with the `on` state.
	toggle = () =>
		this.setState(
			({on}) => ({on: !on}),
			() => this.props.onToggle(this.state.on),
		)

	getTogglerProps = ({onClick, ...props} = {}) => {
		return {
			'aria-pressed': this.state.on,
			onClick: callAll(onClick, this.toggle),
			...props,
		}
	}

	reset = () => {
		this.setState(
			() => (this.initialState),
			// call the reset function passed in as props to log out
			() => this.props.onReset(this.state.on)
		)
	}

	getStateAndHelpers () {
		return {
			on: this.state.on,
			toggle: this.toggle,
			// 🐨 now let's include the reset method here
			// so folks can use that in their implementation.
			getTogglerProps: this.getTogglerProps,
			reset: this.reset
		}
	}

	render () {
		return this.props.children(this.getStateAndHelpers())
	}
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage ({
									initialOn = false,
									onToggle = (...args) => console.log('onToggle', ...args),
									onReset = (...args) => console.log('onReset', ...args),
								}) {
	return (
		<Toggle
			initialOn={initialOn}
			onToggle={onToggle}
			onReset={onReset}
		>
			{({getTogglerProps, on, reset}) => (
				<div>
					<Switch {...getTogglerProps({on})} />
					<hr/>
					<button onClick={() => reset()}>Reset</button>
				</div>
			)}
		</Toggle>
	)
}

Usage.title = 'State Initializers'

export { Toggle, Usage as default }
