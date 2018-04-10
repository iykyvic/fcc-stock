import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import io from 'socket.io-client';
import Settings from './Settings';
import Chart from './Chart';


export default class Stock extends Component {
	defaultStocks = ['CSCO', 'EBAY', 'F', 'FOX', 'GOOGL'];
	socketIo = io(HOST_NAME);
	state = {
		stocks: {},
		loadingSettings: false,
		loadingForm: false,
		openStockForm: false,
		openSnackbar: false,
		SnackbarMessage: '',
		stockFormError: '',
		stockFieldValue: ''
	};
	styles = {
		link: {
			float: 'left'
		},
		footer: {
			display: 'flex',
			width: '100%',
			flexFlow: 'row wrap',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 20
		},
		footerLink: {
			textDecoration: 'none'
		}
	}

	constructor(props) {
		super(props);
		this.addStock = this.addStock.bind(this);
		this.updateStock = this.updateStock.bind(this);
		this.deleteStock = this.deleteStock.bind(this);
		this.openStockForm = this.openStockForm.bind(this);
		this.closeStockForm = this.closeStockForm.bind(this);
		this.setStockFieldValue = this.setStockFieldValue.bind(this);
		this.resetTextInputError = this.resetTextInputError.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
	}

	componentDidMount() {
		this.socketIo.on('stocks', (data) => {
			const { data: stocks, settings } = data;
			const stockInfo = {};
			stocks.forEach(stock => {
				stockInfo[stock.name] = {};
				stockInfo[stock.name].data = stock.data
			});

			settings.forEach(setting => (stockInfo[setting.name].show = setting.show));
			this.setState(prevState => ({ ...prevState, stocks: { ...stockInfo } }));
		});

		this.socketIo.on('loadingSettings', (data) => this
			.setState(prevState => ({ ...prevState,  ...data })));

		this.socketIo.on('loadingForm', (data) => this
			.setState(prevState => ({ ...prevState,  ...data })));

		this.socketIo.on('serverMessage', message => this.setState(prevState => ({
			...prevState, openSnackbar: true, SnackbarMessage: message
		})));
	}

	addStock() {
		if(this.state.stockFieldValue.length < 1) {
			return this.setState(prevState => ({
				...prevState, stockFormError: 'stock symbol required'
			}));
		}
		this.setState(prevState => ({ ...prevState,  loadingForm: true }));

		this.socketIo.emit('add', this.state.stockFieldValue);
	}

	updateStock(data) {
		this.socketIo.emit('update', data);
	}

	deleteStock(stock) {
		this.socketIo.emit('delete', stock);
	}

	openStockForm(event) {
		this.setState(prevState => ({ ...prevState, openStockForm: true }));
	}

	closeStockForm() {
    this.setState(prevState => ({ ...prevState, openStockForm: false, stockFieldValue: '' }));
	};

	setStockFieldValue(event) {
		event.persist();
		const { value } = event.target;
		return this.setState(prevState => ({
			...prevState, stockFieldValue: value
		}));
	}

	resetTextInputError(event) {
		if (event.target.value.length > 0) {
			this.setState(prevState => ({
				...prevState, stockFormError: ''
			}));
			event.target.value = event.target.value.toUpperCase();
		}
	}

	handleSnackbarClose() {
		this.setState(prevState => ({ ...prevState, openSnackbar: false }));
	}

	render() {
		const { stocks } = this.state;
		const renderedStocks = {};
		Object.keys(stocks).forEach(stock => {
			if(stocks[stock].show){
				renderedStocks[stock] = stocks[stock];
			}
		})
		return <div>
			<Settings
				stocks={this.state.stocks}
				defaultStocks={this.defaultStocks}
				updateStock={this.updateStock}
				deleteStock={this.deleteStock}
				openStockForm={this.openStockForm}
				loadingSettings={this.state.loadingSettings}
				loadingForm={this.state.loadingForm}
			/>
			<Chart stocks={renderedStocks}/>
			<Dialog
				title="Add New Stock"
				actions={[
					<a
						href="https://www.marketwatch.com/tools/quotes/lookup.asp"
						target="_blank"
						style={this.styles.link}
					>
					  <FlatButton
							label="GET STOCK SYMBOLS"
							primary={true}
							onClick={this.closeStockForm.bind(this)}
						/>
					</a>,
					<FlatButton
						label="CLOSE"
						primary={true}
						onClick={this.closeStockForm.bind(this)}
					/>,
					<RaisedButton
						label="ADD STOCK"
						primary={true}
						disabled={this.state.loadingForm}
						onClick={this.addStock.bind(this)}
					/>,
				]}
				modal={false}
				open={this.state.openStockForm}
				onRequestClose={this.closeStockForm}
			>
				<TextField
					hintText="See https://www.marketwatch.com/tools/quotes/lookup.asp for symbols"
					errorText={this.state.stockFormError}
					floatingLabelText="Enter Stock Symbol"
					fullWidth={true}
					onChange={this.resetTextInputError}
					onBlur={this.setStockFieldValue}
					defaultValue={this.state.stockFieldValue}
				/>
			</Dialog>
			<Snackbar
				open={this.state.openSnackbar}
				message={this.state.SnackbarMessage}
				autoHideDuration={5000}
				onRequestClose={this.handleSnackbarClose}
			/>
			<div style={this.styles.footer}>
			  <a style={this.styles.footerLink} href="http://githu.com/iykyvic">@iykyvic</a>
			</div>
		</div>
	}
}
