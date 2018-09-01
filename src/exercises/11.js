// The provider pattern
import React, { Fragment } from 'react'
import { Switch } from '../switch'

// 🐨 create your React context here with React.createContext
const ToggleContext = React.createContext()

function ToggleConsumer (props) {
	return (
		<ToggleContext.Consumer {...props}>
			{context => {
				if (!context) {
					throw new Error(
						`Toggle compound components cannot be rendered outside the Toggle component`,
					)
				}
				return props.children(context)
			}
			}
		</ToggleContext.Consumer>
	)
}

class Toggle extends React.Component {

	// 🐨 expose the ToggleContext.Consumer as a static property of Toggle here.
	static Consumer = ToggleConsumer
	static On = ({children}) =>
		<Toggle.Consumer>
			{contextValue => (contextValue.on ? children : null)}
		</Toggle.Consumer>
	static Off = ({children}) =>
		<Toggle.Consumer>
			{contextValue => (!contextValue.on ? children : null)}
		</Toggle.Consumer>
	static Button = ({...props}) =>
		<Toggle.Consumer>
			{({on, toggle}) => <Switch on={on} onClick={toggle} {...props}/>}
		</Toggle.Consumer>

	toggle = () =>
		this.setState(
			({on}) => ({on: !on}),
			() => this.props.onToggle(this.state.on),
		)

	initialState = {
		on: false,
		toggle: this.toggle
	}
	state = this.initialState

	render () {
		const {children, ...rest} = this.props
		console.log('rest', rest)

		const ui =
			typeof children === 'function' ? children(this.state) : children
		return (
			<ToggleContext.Provider value={this.state} {...rest}>
				{ui}
			</ToggleContext.Provider>
		)
	}
}

// 💯 Extra credit: Add a custom Consumer that validates the
// ToggleContext.Consumer is rendered within a provider
//
// 💯 Extra credit: avoid unecessary re-renders by only updating the value when
// state changes
//
// 💯 Extra credit: support render props as well
//
// 💯 Extra credit: support (and expose) compound components!

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
const Layer1 = () => <Layer2/>
const Layer2 = () => (
	<Toggle.Consumer>
		{({on}) => (
			<Fragment>
				{on ? 'The button is on' : 'The button is off'}
				<Layer3/>
			</Fragment>
		)}
	</Toggle.Consumer>
)
const Layer3 = () => <Layer4/>
const Layer4 = () => (
	<Toggle.Consumer>
		{({on, toggle}) => <Switch on={on} onClick={toggle}/>}
	</Toggle.Consumer>
)

function Usage ({
									onToggle = (...args) => console.log('onToggle', ...args),
								}) {
	return (
		<Toggle onToggle={onToggle} test='spencer'>
			<Toggle.On>The button is on</Toggle.On>
			<Toggle.Off>The button is off</Toggle.Off>
			<div>
				<Toggle.Button/>
			</div>
		</Toggle>
	)
}

/*
// without the changes you're going to make,
// this is what the usage would look like. You're looking at "prop drilling"

const Layer1 = ({on, toggle}) => <Layer2 on={on} toggle={toggle} />
const Layer2 = ({on, toggle}) => (
  <Fragment>
    {on ? 'The button is on' : 'The button is off'}
    <Layer3 on={on} toggle={toggle} />
  </Fragment>
)
const Layer3 = ({on, toggle}) => <Layer4 on={on} toggle={toggle} />
const Layer4 = ({on, toggle}) => <Switch on={on} onClick={toggle} />

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => <Layer1 on={on} toggle={toggle} />}
    </Toggle>
  )
}
*/

Usage.title = 'The Provider Pattern'

export { Toggle, Usage as default }
