import { type as arktype } from 'arktype'

/**
 * Axelarscan GMP `searchGMP` wire shapes.
 * @see https://docs.axelarscan.io/gmp
 * @see https://github.com/axelarnetwork/axelarjs/blob/main/packages/api/src/gmp/types.ts
 */

const nonnegativeIntegerString = arktype('/^(?:0|[1-9]\\d*)$/')
const bytes32String = arktype('/^0x[0-9a-fA-F]{64}$/')

export const axelarscanReceiptEnvelope = arktype({
	'gasUsed?': 'string',
	'effectiveGasPrice?': 'string',
	'confirmations?': 'number.integer >= 0',
	'from?': 'string',
	'status?': 'number | string',
	'blockNumber?': 'number | string',
	'transactionHash?': 'string',
	'transactionIndex?': 'number.integer >= 0',
	'cumulativeGasUsed?': 'string',
	'gasLimit?': 'string',
	'logs?': 'unknown[]',
})

export const axelarscanEventEnvelope = arktype({
	chain: 'string',
	transactionHash: 'string',
	'transactionIndex?': 'number.integer >= 0',
	'logIndex?': 'number.integer >= 0',
	'_logIndex?': 'number.integer >= 0',
	'id?': 'string',
	'blockNumber?': 'number.integer >= 0 | string',
	block_timestamp: 'number.integer >= 0',
	'blockTimestamp?': 'number.integer >= 0',
	event: 'string',
	'chain_type?': 'string',
	'receipt?': axelarscanReceiptEnvelope,
})

export const axelarscanContractCallEnvelope = axelarscanEventEnvelope.and(arktype({
	returnValues: {
		sender: 'string',
		destinationChain: 'string',
		destinationContractAddress: 'string',
		payloadHash: 'string',
		'payload?': 'string',
		'symbol?': 'string',
		'amount?': 'string | number',
	},
}))

export const axelarscanGasPaidEnvelope = axelarscanEventEnvelope.and(arktype({
	returnValues: {
		'refundAddress?': 'string',
		sourceAddress: 'string',
		destinationAddress: 'string',
		gasFeeAmount: 'string',
		payloadHash: 'string',
		destinationChain: 'string',
	},
}))

export const axelarscanApprovedEnvelope = axelarscanEventEnvelope.and(arktype({
	returnValues: {
		sourceEventIndex: 'string | number',
		sourceChain: 'string',
		sourceAddress: 'string',
		sourceTxHash: 'string',
		contractAddress: 'string',
		payloadHash: 'string',
		commandId: 'string',
	},
}))

export const axelarscanExecutedEnvelope = axelarscanEventEnvelope.and(arktype({
	sourceTransactionHash: 'string',
	'sourceTransactionIndex?': 'number.integer >= 0',
	'sourceTransactionLogIndex?': 'number.integer >= 0',
	'relayerAddress?': 'string',
	'from?': 'string',
}))

export const axelarscanConfirmationEnvelope = arktype({
	sourceChain: 'string',
	blockNumber: 'number.integer >= 0',
	block_timestamp: 'number.integer >= 0',
	sourceTransactionHash: 'string',
	transactionHash: 'string',
	poll_id: 'string',
	confirmation_txhash: 'string',
})

export const axelarscanGmpFeesEnvelope = arktype({
	'base_fee_usd?': 'number',
	'source_base_fee_usd?': 'number',
	'destination_base_fee_usd?': 'number',
	'express_fee_usd?': 'number',
})

export const axelarscanGmpMessageEnvelope = arktype({
	call: axelarscanContractCallEnvelope,
	message_id: 'string',
	'command_id?': 'string',
	'gas_paid?': axelarscanGasPaidEnvelope,
	'confirm?': axelarscanConfirmationEnvelope,
	'approved?': axelarscanApprovedEnvelope,
	'executed?': axelarscanExecutedEnvelope,
	status: 'string',
	simplified_status: 'string',
	'amount?': 'string | number',
	'symbol?': 'string',
	'fees?': axelarscanGmpFeesEnvelope,
	'time_spent?': {
		'call_confirm?': 'number.integer >= 0',
		'call_approved?': 'number.integer >= 0',
		'total?': 'number.integer >= 0',
	},
})

export const axelarscanGmpResponseEnvelope = arktype({
	data: axelarscanGmpMessageEnvelope.array(),
	total: 'number.integer >= 0',
	time_spent: 'number.integer >= 0',
})

export const axelarscanErrorEnvelope = arktype({
	error: 'true',
	'code?': 'number',
	'message?': 'string',
	'method?': 'string',
	'params?': 'Record<string, unknown>',
	'time_spent?': 'number',
})

export type AxelarscanReceipt = {
	gasUsed?: string
	effectiveGasPrice?: string
	confirmations?: number
	from?: string
	status?: number | string
	blockNumber?: number | string
	transactionHash?: string
	transactionIndex?: number
	cumulativeGasUsed?: string
	gasLimit?: string
	logs?: unknown[]
}

export type AxelarscanEvent = {
	chain: string
	transactionHash: string
	transactionIndex?: number
	logIndex?: number
	_logIndex?: number
	id?: string
	blockNumber?: number | string
	block_timestamp: number
	blockTimestamp?: number
	event: string
	chain_type?: string
	receipt?: AxelarscanReceipt
}

export type AxelarscanContractCall = AxelarscanEvent & {
	returnValues: {
		sender: string
		destinationChain: string
		destinationContractAddress: string
		payloadHash: string
		payload?: string
		symbol?: string
		amount?: string | number
	}
}

export type AxelarscanGasPaid = AxelarscanEvent & {
	returnValues: {
		refundAddress?: string
		sourceAddress: string
		destinationAddress: string
		gasFeeAmount: string
		payloadHash: string
		destinationChain: string
	}
}

export type AxelarscanApproved = AxelarscanEvent & {
	returnValues: {
		sourceEventIndex: string | number
		sourceChain: string
		sourceAddress: string
		sourceTxHash: string
		contractAddress: string
		payloadHash: string
		commandId: string
	}
}

export type AxelarscanExecuted = AxelarscanEvent & {
	sourceTransactionHash: string
	sourceTransactionIndex?: number
	sourceTransactionLogIndex?: number
	relayerAddress?: string
	from?: string
}

export type AxelarscanConfirmation = {
	sourceChain: string
	blockNumber: number
	block_timestamp: number
	sourceTransactionHash: string
	transactionHash: string
	poll_id: string
	confirmation_txhash: string
}

export type AxelarscanGmpFees = {
	base_fee_usd?: number
	source_base_fee_usd?: number
	destination_base_fee_usd?: number
	express_fee_usd?: number
}

export type AxelarscanGmpMessage = {
	call: AxelarscanContractCall
	message_id: string
	command_id?: string
	gas_paid?: AxelarscanGasPaid
	confirm?: AxelarscanConfirmation
	approved?: AxelarscanApproved
	executed?: AxelarscanExecuted
	status: string
	simplified_status: string
	amount?: string | number
	symbol?: string
	fees?: AxelarscanGmpFees
	time_spent?: {
		call_confirm?: number
		call_approved?: number
		total?: number
	}
}

export type AxelarscanGmpResponse = {
	data: AxelarscanGmpMessage[]
	total: number
	time_spent: number
}

export type AxelarscanErrorEnvelope = {
	error: true
	code?: number
	message?: string
	method?: string
	params?: Record<string, unknown>
	time_spent?: number
}

export {
	bytes32String,
	nonnegativeIntegerString,
}
