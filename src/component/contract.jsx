import React from 'react';
import {
	Tree,
	Row,
	Col,
	Button,
}
from 'antd';
import ReactMarkdown from "react-markdown";
import classNames from 'classnames';
import PubSub from "pubsub-js";
import "./contract.less";

export default class Contract extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data
		};
	}
	_click() {
		console.log(1);
		PubSub.publish('_back', {
			visible: false,
			modalTitle: '',
			modalContent: '',
		});
	}
	render() {
		return (
			<div>
				<br />
				<br />
				<Row>
					<Col span="2">
						<Button type="primary" size="small" onClick={this._click.bind(this)}>返回列表</Button>
					</Col>
					<Col span="18" className="">
						&nbsp;
					</Col>
					<Col span="2">
						<Button type="primary" size="small" >点击下载</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<h1>{this.state.data.title}</h1>
					</Col>
				</Row>
				<br />
				<br />
				<Row>
					<Col className="date">
						发布时间:{this.state.data.publishAt}
					</Col>
				</Row>
				<br />
				<br />
				<Row className="content">
					<ReactMarkdown source={this.state.data.content} />
				</Row>
				<br />
				<br />
			</div>
		);
	}
}