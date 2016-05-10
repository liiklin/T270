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
} from 'es6-promise';
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
			let datas = new Array();
			product.map((val, index) => {
				datas.push(
					<Lists key={index} url={this.state.url} data={val}/>
				);
			});
			this.setState({
				datas: datas
			});
		}.bind(this));
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.pubsub_token);
	}
	handleInputChange(e) {
		this.setState({
			value: e.target.value,
		});
	}
	handleFocusBlur(e) {
		this.setState({
			focus: e.target === document.activeElement,
		});
	}
	handleSearch() {
		let words = this.state.value;
		if (words) {
			fetch(`${this.state.url}/texts?word=${words}`)
				.then(res => res.json())
				.then(res => {
					this.setState({
						datas: new Array()
					});
					let datas = new Array();
					res.map((val, index) => {
						datas.push(
							<Lists key={index} url={this.state.url} data={val}/>
						);
					});
					this.setState({
						datas: datas
					});
				}).catch((error) => {
					console.error(error);
				});
		}
	}
	render() {
		const btnCls = classNames({
			'ant-search-btn': true,
			'ant-search-btn-noempty': !!this.state.value.trim(),
		});
		const searchCls = classNames({
			'ant-search-input': true,
			'ant-search-input-focus': this.state.focus,
		});
		return (
			<div>
				<Row>
					<Col span="1"></Col>
					<Col span="22">
				      <InputGroup className={searchCls} style={this.props.style}>
				        <Input {...this.props} value={this.state.value} onChange={this.handleInputChange.bind(this)}
				          onFocus={this.handleFocusBlur.bind(this)} onBlur={this.handleFocusBlur.bind(this)} />
				        <div className="ant-input-group-wrap">
				          <Button className={btnCls} size={this.props.size} onClick={this.handleSearch.bind(this)}>
				            <Icon type="search" />
				          </Button>
				        </div>
				      </InputGroup>
					</Col>
				</Row>
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