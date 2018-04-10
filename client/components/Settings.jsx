import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconMenu from 'material-ui/IconMenu';

export default function Settings(props) {
	const {
		stocks,
		defaultStocks,
		addStock,
		updateStock,
		deleteStock,
		openStockForm,
		loadingSettings,
		loadingForm
	} = props;
	const styles = {
		list: {
			border: '1px solid #eee',
			margin: 10
		},
		checkbox: {
			marginBottom: 16,
		},
		cardHeader: {
			marginLeft: 'autos'
		},
		delete: {
			right: 0
		},
		fab: {
			position: 'absolute',
			right: 50,
			top: -55
		},
		actions: {
			padding: 0
		}
	};

	return (
		<Card>
			<CardHeader
				title="FCC STOCKS"
				subtitle="historical trendlines for stocks"
				actAsExpander={true}
				showExpandableButton={true}
			/>
			<CardText expandable={true}>
				<List className="flex">
					<Subheader>Stocks</Subheader>
					{Object.keys(stocks).map((stock, index) => (<ListItem
						key={`stock-${index}`}
						className="flex-item-check"
						style={styles.list}
						primaryText={stock}
						leftCheckbox={<Checkbox
							checked={stocks[stock].show}
							onCheck={updateStock.bind(null, { name: stock, show: !stocks[stock].show, index })}
							style={styles.checkbox}
						/>}
						rightIconButton={
							defaultStocks.includes(stock) ?
							null :
							<IconButton
									key={`stock-${index}`}
									tooltip={`delete ${stock}`}
									touch={true}
									disabled={loadingSettings}
									tooltipPosition="top-right"
									style={styles.delete}
									onClick={deleteStock.bind(null, stock)}
								>
								<ActionDelete />
							</IconButton>
						}
					/>))}
				</List>
			</CardText>

			<CardActions style={styles.actions}>
				<FloatingActionButton
					mini={true}
					secondary={true}
					style={styles.fab}
					onClick={openStockForm}
					disabled={loadingSettings}
				>
					<ContentAdd />
				</FloatingActionButton>
			</CardActions>
		</Card>
	);
}

Settings.propTypes = {
	stocks: PropTypes.object.isRequired,
	defaultStocks: PropTypes.array.isRequired,
	updateStock: PropTypes.func.isRequired,
	deleteStock: PropTypes.func.isRequired,
	openStockForm: PropTypes.func.isRequired,
	loadingSettings: PropTypes.bool.isRequired,
	loadingForm: PropTypes.bool.isRequired
}
