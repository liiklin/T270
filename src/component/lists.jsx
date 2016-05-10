import React from 'react';
import {
	Icon,
	Form,
	Input,
	Row,
	Col,
	Button,
	Modal,
	Pagination
}
from 'antd';
import {
	polyfill
} from 'es6-promise';
import fetch from 'isomorphic-fetch';
import _ from "underscore";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import './lists.less';

export default class lists extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		// console.log(this.props);
		this.state = {
			data: this.props.data,
			url: this.props.url,
			level: new Array(),
			texts: new Array(),
			visible: false,
			modalTitle: '',
			modalContent: '',
			pageSize: this.props.pageSize || 10,
			pages: '',
			footer : <div></div>
		};
	}

	componentDidMount() {
		let texts = _.map(this.state.data.texts.slice(0, this.state.pageSize), (text, index) => {
			return (
				<Row className="text" key={text.id}>
					<Col span="1" style={{textAlign:"center"}}>
						{index+1}、
					</Col>
					<Col span="20">
						{text.name}&nbsp;&nbsp;&nbsp;&nbsp;(颁布日期:{moment(text.issue_date).format("YYYY-MM-DD")})
					</Col>
					<Col span="3">
						<Button type="primary" size="small" onClick={this.showModal.bind(this,text)}>查看全文</Button>
					</Col>
				</Row>
			)
		});
		let pages = <Pagination size='small' pageSize={this.state.pageSize} onChange={this.onChange.bind(this)} total={this.state.data.texts.length} />;
		this.setState({
			level: this.state.data.level,
			texts: texts,
			pages: pages,
		});
	}

	clickTitle(e) {
		e.preventDefault();
	}

	showModal(text) {
		fetch(`${this.state.url}/texts/${text.id}`)
			.then(res => res.json())
			.then(res => {
				this.setState({
					visible: true,
					modalTitle: res.name,
					modalContent: <ReactMarkdown source={res.content} />,
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	handleOk() {
		console.log('点击了确定');
		this.setState({
			visible: false,
			modalTitle: '',
			modalContent: '',
		});
	}
	handleCancel(e) {
		this.setState({
			visible: false,
			modalTitle: '',
			modalContent: '',
		});
	}
	onChange(page) {
		console.log(page);
		let texts = _.map(this.state.data.texts.slice((page - 1) * this.state.pageSize, page * this.state.pageSize), (text, index) => {
			return (
				<Row className="text" key={text.id}>
					<Col span="1" style={{textAlign:"center"}}>
						{index+1}、
					</Col>
					<Col span="20">
						{text.name}&nbsp;&nbsp;&nbsp;&nbsp;(颁布日期:{moment(text.issue_date).format("YYYY-MM-DD")})
					</Col>
					<Col span="3">
						<Button type="primary" size="small" onClick={this.showModal.bind(this,text)}>查看全文</Button>
					</Col>
				</Row>
			)
		});
		this.setState({
			level: this.state.data.level,
			texts: texts,
		});
	}
	render() {
		return (
			<div>
				<Row>
					<div className="header">
						<span className="title">
							<a title="点击进入高级检索" 
							onClick={this.clickTitle.bind(this)}>
							{this.state.data?this.state.data.level.name:''}&nbsp;&nbsp;&nbsp;&nbsp;(共{this.state.data.texts.length}篇) 
							</a>
						</span>
					</div>
					<div className="lists">
						{this.state.texts}
						<Row className="text pages">
							<Col span="1">
								&nbsp;
							</Col>
							<Col span="21" className="">
								{this.state.pages}
							</Col>
							<Col span="2">
								&nbsp;
							</Col>
						</Row>
					</div>
				</Row>
				<div>
			        <Modal title={this.state.modalTitle} visible={this.state.visible}
			          footer={this.state.footer}
			          onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
						{this.state.modalContent}
			        </Modal>
		      	</div>
	      	</div>
		);
	}
}