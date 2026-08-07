import { type } from 'arktype'


const hex64 = '/^[0-9a-f]{64}$/'
const integerString = '/^-?(0|[1-9]\\d*)$/'


export const InternetComputerRosettaNetworkIdentifier = type({
	blockchain: "'Internet Computer'",
	network: "'00000000000000020101'",
})

export type InternetComputerRosettaNetworkIdentifier = typeof InternetComputerRosettaNetworkIdentifier.infer

export const InternetComputerRosettaBlockIdentifier = type({
	index: 'number.integer >= 0',
	hash: hex64,
})

export type InternetComputerRosettaBlockIdentifier = typeof InternetComputerRosettaBlockIdentifier.infer

export const InternetComputerRosettaAccountIdentifier = type({
	address: hex64,
})

export type InternetComputerRosettaAccountIdentifier = typeof InternetComputerRosettaAccountIdentifier.infer

export const InternetComputerRosettaCurrency = type({
	symbol: 'string > 0',
	decimals: 'number.integer >= 0',
})

export type InternetComputerRosettaCurrency = typeof InternetComputerRosettaCurrency.infer

export const InternetComputerRosettaAmount = type({
	value: integerString,
	currency: InternetComputerRosettaCurrency,
})

export type InternetComputerRosettaAmount = typeof InternetComputerRosettaAmount.infer

export const InternetComputerRosettaAccountBalanceResponse = type({
	block_identifier: InternetComputerRosettaBlockIdentifier,
	balances: InternetComputerRosettaAmount.array(),
})

export type InternetComputerRosettaAccountBalanceResponse = typeof InternetComputerRosettaAccountBalanceResponse.infer

export const InternetComputerRosettaOperation = type({
	operation_identifier: {
		index: 'number.integer >= 0',
	},
	type: 'string > 0',
	'status?': 'string > 0',
	'account?': InternetComputerRosettaAccountIdentifier,
	'amount?': InternetComputerRosettaAmount,
})

export type InternetComputerRosettaOperation = typeof InternetComputerRosettaOperation.infer

export const InternetComputerRosettaTransaction = type({
	transaction_identifier: {
		hash: hex64,
	},
	operations: InternetComputerRosettaOperation.array(),
	'metadata?': {
		'block_height?': 'number.integer >= 0',
		'memo?': 'number.integer >= 0',
		'created_at_time?': 'number.integer >= 0',
	},
})

export type InternetComputerRosettaTransaction = typeof InternetComputerRosettaTransaction.infer

export const InternetComputerRosettaBlockTransaction = type({
	block_identifier: InternetComputerRosettaBlockIdentifier,
	transaction: InternetComputerRosettaTransaction,
})

export type InternetComputerRosettaBlockTransaction = typeof InternetComputerRosettaBlockTransaction.infer

export const InternetComputerRosettaSearchTransactionsResponse = type({
	transactions: InternetComputerRosettaBlockTransaction.array(),
	total_count: 'number.integer >= 0',
	'next_offset?': 'number.integer >= 0',
})

export type InternetComputerRosettaSearchTransactionsResponse = typeof InternetComputerRosettaSearchTransactionsResponse.infer

export const InternetComputerRosettaNetworkStatusResponse = type({
	current_block_identifier: InternetComputerRosettaBlockIdentifier,
	current_block_timestamp: 'number.integer >= 0',
	genesis_block_identifier: InternetComputerRosettaBlockIdentifier,
})

export type InternetComputerRosettaNetworkStatusResponse = typeof InternetComputerRosettaNetworkStatusResponse.infer

export const InternetComputerRosettaBlockResponse = type({
	block: {
		block_identifier: InternetComputerRosettaBlockIdentifier,
		parent_block_identifier: InternetComputerRosettaBlockIdentifier,
		timestamp: 'number.integer >= 0',
		transactions: InternetComputerRosettaTransaction.array(),
	},
})

export type InternetComputerRosettaBlockResponse = typeof InternetComputerRosettaBlockResponse.infer

export const InternetComputerRosettaNetworkOptionsResponse = type({
	allow: {
		operation_statuses: type({
			status: 'string > 0',
			successful: 'boolean',
		}).array(),
		operation_types: type('string > 0').array(),
	},
})

export type InternetComputerRosettaNetworkOptionsResponse = typeof InternetComputerRosettaNetworkOptionsResponse.infer
