import React from 'react';
import {
	Tree,
}
from 'antd';
import './categories.less';
import _ from "underscore";
import PubSub from "pubsub-js";
import {
	polyfill
} from 'es6-promise';
import fetch from 'isomorphic-fetch';

const TreeNode = Tree.TreeNode;

function setLeaf(treeData, curKey, level) {
	const loopLeaf = (data, lev) => {
		const l = lev - 1;
		data.forEach((item) => {
			if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
				curKey.indexOf(item.key) !== 0) {
				return;
			}
			if (item.children) {
				loopLeaf(item.children, l);
			} else if (l < 1) {
				item.isLeaf = true;
			}
		});
	};
	loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
	const loop = (data) => {
		if (level < 1 || curKey.length - 3 > level * 2) return;
		data.forEach((item) => {
			if (curKey.indexOf(item.key) === 0) {
				if (item.children) {
					loop(item.children);
				} else {
					item.children = child;
				}
			}
		});
	};
	loop(treeData);
	setLeaf(treeData, curKey, level);
}

export default class categories extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			treeData: [{
				name: "法律",
				key: 0,
				isLeaf: false
			}],
			url: this.props.url,
			selected: ["-1"],
			expanded: ["-1"]
		};
	}
	componentDidMount() {
		fetch(`${this.state.url}/categories`)
			.then(res => res.json())
			.then(res => {
				let treeNodes = _.map(res, (val) => {
					return {
						name: val.name,
						key: val.id,
						isLeaf: true
					}
				});
				const treeData = [...this.state.treeData];
				getNewTreeData(treeData, "0", treeNodes, 2);
				this.setState({
					treeData
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	onSelect(info) {
		// console.log(info)
		if (info.length) {
			// console.log(`${this.state.url}/categories/${info[0]}/texts`)
			fetch(`${this.state.url}/categories/${info[0]}/texts`)
				.then(res => res.json())
				.then(res => {
					PubSub.publish('products', res);
					// console.log(JSON.stringify(res))
				}).catch((error) => {
					console.error(error);
				});
			let expand = (info == this.state.expanded) ? [] : info
			this.setState({
				selected: info,
				expanded: info
			});
		}
	}
	render() {
		const loop = data => data.map((item) => {
			if (item.children) {
				return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
			}
			return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} />;
		});
		const treeNodes = loop(this.state.treeData);
		return (
			<Tree selectedKeys={this.state.selected} onSelect={this.onSelect.bind(this)} >
       		 {treeNodes}
      		</Tree>
		);
	}
}