import React from 'react';
import {
	Icon,
	Form,
	Input,
	Row,
	Col,
	Button,
}
from 'antd';
import {
	polyfill
}
from 'es6-promise';
import fetch from 'isomorphic-fetch';
import _ from "underscore";
import classNames from 'classnames';
import Lists from "./lists";
import './texts.less';
import PubSub from "pubsub-js";

const InputGroup = Input.Group;

export default class texts extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			iconLoading: false,
			value: '',
			focus: false,
			url: this.props.url,
			datas: new Array(),
		};
	}
	componentDidMount() {
		this.pubsub_token = PubSub.subscribe('products', function(topic, product) {
			this.setState({
				datas: new Array()
			});
			this.setState({
				datas: <Lists url={this.state.url} data={product}/>
			});
		}.bind(this));
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	render() {
		return (
			<div>
				<Row>
					<Col span="1"></Col>
					<Col span="22">
						<Row>
							{this.state.datas}
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}