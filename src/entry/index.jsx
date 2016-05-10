import '../common/lib';
import Categories from '../component/categories';
import Texts from '../component/texts';
import ReactDOM from 'react-dom';
import React, {
	Component,
}
from 'react';

import {
	Row,
	Col
}
from "antd";

const url = "http://127.0.0.1:8360";

class App extends React.Component {
	render() {
		return (
			<div style={{display:"flex",flex:4}}> 
				<div style ={{flex:1,background:"#FFFFFF"}}>
					<Categories url={url}/> 
				</div>
				<div style ={{flex:3,paddingLeft:5,paddingRight:5,paddingTop:5,paddingBottom:5,}}>
					<Texts url={url} />
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('react-content'));