// Flexible Compound Components with context
// When you have several components that need to share state but the user doesnt need to know about the state....?
import React from 'react'
import { Switch } from '../switch'

// Right now our component can only clone and pass props to immediate children.
// So we need some way for our compound components to implicitly accept the on
// state and toggle method regardless of where they're rendered within the
// Toggle component's "posterity" :)
//
// The way we do this is through context. React.createContext is the API we
// want. Here's a simple example of that API:
//
// const defaultValue = 'light'
// const ThemeContext = React.createContext(defaultValue)
//   Note: The `defaultValue` can be an object, function, or anything.
//   It's simply what React will use if the ThemeContext.Consumer is rendered
//   outside a ThemeContext.Provider
//
// ...
// <ThemeContext.Provider value={this.state}>
//   {this.props.children}
// </ThemeContext.Provider>
// ...
//
// ...
// <ThemeContext.Consumer>
//   {contextValue => <div>The current theme is: {contextValue}</div>}
// </ThemeContext.Consumer>
// ...
//
// NOTE: Spacing matters!! For example, these are not the same:
// <Context.Consumer> {val => val} </Context.Consumer>
// <Context.Consumer>{val => val}</Context.Consumer>
//
// To visualize the difference, here's what these would be with a named children prop:
// <Context.Consumer children={[' ', {val => val}, ' ']} />
// <Context.Consumer children={val => val} />
// make sure that you don't have the extra space in there
//   (newlines are ok, like in the above example)

// 🐨 create a ToggleContext with React.createContext here
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
	// 🐨 each of these compound components will need to be changed to use
	// ToggleContext.Consumer and rather than getting `on` and `toggle`
	// from props, it'll get it from the ToggleContext.Consumer value.
	static On = ({children}) =>
		<ToggleConsumer>
			{contextValue => (contextValue.on ? children : null)}
		</ToggleConsumer>
	static Off = ({children}) =>
		<ToggleConsumer>
			{contextValue => (!contextValue.on ? children : null)}
		</ToggleConsumer>

	static Button = ({...props}) => {
		// props is empty but just for show if you want to use them in your own app.
		return (
			<ToggleConsumer>
				{({on, toggle}) => <Switch on={on} onClick={toggle} {...props} />}
			</ToggleConsumer>
		)
	}

	// The reason we had to move `toggle` above `state` is because
	// in our `state` initialization we're _using_ `this.toggle`. So
	// if `this.toggle` is not defined before state is initialized, then
	// `state.toggle` will be undefined.
	toggle = () =>
		this.setState(
			({on}) => ({on: !on}),
			() => this.props.onToggle(this.state.on),
		)
	state = {on: false, toggle: this.toggle}

	render () {
		// Because this.props.children is _immediate_ children only, we need
		// to 🐨 remove this map function and render our context provider with
		// this.props.children as the children of the provider. Then we'll
		// expose the `on` state and `toggle` method as properties in the context
		// value (the value prop).

		// return React.Children.map(this.props.children, child =>
		//   React.cloneElement(child, {
		//     on: this.state.on,
		//     toggle: this.toggle,
		//   }),
		// )

		return (
			<ToggleContext.Provider value={{on: this.state.on, toggle: this.toggle}}>
				{this.props.children}
			</ToggleContext.Provider>
		)
	}
}

// 💯 Extra credit: rather than having a default value, make it so the consumer
// will throw an error if there's no context value to make sure people don't
// attempt to render one of the compound components outside the Toggle.

// 💯 Extra credit: avoid unecessary re-renders of the consumers by not
// creating a new `value` object ever render and instead passing an object
// which only changes when the state changes.

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage ({
									onToggle = (...args) => console.log('onToggle', ...args),
								}) {
	return (
		<Toggle onToggle={onToggle}>
			<Toggle.On>The button is on</Toggle.On>
			<Toggle.Off>The button is off</Toggle.Off>
			<div>
				<Toggle.Button/>
			</div>
		</Toggle>
	)
}

Usage.title = 'Flexible Compound Components'

export { Toggle, Usage as default }
