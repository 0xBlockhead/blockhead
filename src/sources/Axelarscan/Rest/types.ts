export type AxelarscanReceipt = {
	gasUsed: string
	effectiveGasPrice: string
	confirmations?: number
}

export type AxelarscanEvent = {
	chain: string
	transactionHash: string
	transactionIndex: number
	logIndex: number
	id: string
	blockNumber: number
	block_timestamp: number
	event: string
	receipt?: AxelarscanReceipt
}

export type AxelarscanContractCall = AxelarscanEvent & {
	returnValues: {
		sender: string
		destinationChain: string
		destinationContractAddress: string
		payloadHash: string
		payload: string
	}
}

export type AxelarscanGasPaid = AxelarscanEvent & {
	returnValues: {
		refundAddress: string
		sourceAddress: string
		destinationAddress: string
		gasFeeAmount: string
		payloadHash: string
		destinationChain: string
	}
}

export type AxelarscanApproved = AxelarscanEvent & {
	returnValues: {
		sourceEventIndex: string
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
	sourceTransactionIndex: number
	sourceTransactionLogIndex: number
	relayerAddress?: string
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
