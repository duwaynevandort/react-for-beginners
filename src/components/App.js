import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			fishes: {},
			order: {}
		}
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
	}

	componentWillMount() {
		// This runs right before the <App> is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`
			, {
				context: this,
				state: 'fishes'
			});

		// Check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

		if(localStorageRef) {
			// update our App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}

	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key) {
		// take a copy of our state
		const order = {...this.state.order};
		// update or add the new number of fish ordered
		order[key] = order[key] + 1 || 1;
		// update our state
		this.setState({order});
	}

	addFish(fish) {
		// update our state
		const fishes = {...this.state.fishes};
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object.keys(this.state.fishes)
							.map(key => <Fish key={key} addToOrder={this.addToOrder} index={key} details={this.state.fishes[key]}/>)
						}
					</ul>
				</div>
					<Order fishes={this.state.fishes} order={this.state.order} params={this.props.params}/>
					<Inventory addFish={this.addFish} updateFish={this.updateFish} loadSamples={this.loadSamples} fishes={this.state.fishes}/>
			</div>
		)
	}
}

export default App;