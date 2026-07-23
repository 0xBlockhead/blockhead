export type LayerZeroMessageStatus =
	| 'INFLIGHT'
	| 'CONFIRMING'
	| 'DELIVERED'
	| 'FAILED'
	| 'BLOCKED'
	| 'PAYLOAD_STORED'
	| 'APPLICATION_BURNED'
	| 'APPLICATION_SKIPPED'
	| 'UNRESOLVABLE_COMMAND'
	| 'MALFORMED_COMMAND'

export type LayerZeroSourceStatus =
	| 'WAITING'
	| 'VALIDATING_TX'
	| 'SUCCEEDED'
	| 'WAITING_FOR_HASH_DELIVERED'
	| 'UNRESOLVABLE_COMMAND'
	| 'MALFORMED_COMMAND'

export type LayerZeroStageStatus =
	| 'WAITING'
	| 'VALIDATING_TX'
	| 'SUCCEEDED'
	| 'FAILED'
	| 'SIMULATION_REVERTED'
	| 'N/A'

export type LayerZeroTransaction = {
	txHash: string
	blockHash: string
	blockNumber: string
	blockTimestamp: number
	from: string
	blockConfirmations?: number
	payload?: string
	value?: string
	readinessTimestamp?: number
	resolvedPayload?: string
	options?: {
		lzReceive?: {
			gas: string
			value: string
		}
		nativeDrop?: {
			amount: string
			receiver: string
		}[]
		compose?: {
			index: number
			gas: string
			value: string
		}[]
		ordered?: boolean
	}
}

export type LayerZeroMessage = {
	pathway: {
		srcEid: number
		dstEid: number
		sender: {
			address: string
			id?: string
			name?: string
			chain: string
		}
		receiver: {
			address: string
			id?: string
			name?: string
			chain: string
		}
		id: string
		nonce: number
	}
	source: {
		status: LayerZeroSourceStatus
		tx: LayerZeroTransaction
		failedTx?: string[]
	}
	destination?: {
		status: LayerZeroStageStatus
		tx?: LayerZeroTransaction
		failedTx?: string[]
		nativeDrop?: {
			status: LayerZeroStageStatus
			tx?: LayerZeroTransaction
		}
		lzCompose?: {
			status: LayerZeroStageStatus
			tx?: LayerZeroTransaction
		}
	}
	verification: {
		dvn: {
			status: LayerZeroStageStatus
			dvns: Record<string, {
				status: LayerZeroStageStatus
				tx?: LayerZeroTransaction
			}>
		}
		sealer: {
			status: LayerZeroStageStatus
			tx?: LayerZeroTransaction
		}
	}
	guid: string
	config: {
		error: boolean
		errorMessage?: string
		dvnConfigError: boolean
		receiveLibrary?: string
		sendLibrary?: string
		ulnSendVersion?: string
		ulnReceiveVersion?: string
	}
	status: {
		name: LayerZeroMessageStatus
		message: string
	}
	created: string
	updated: string
}

export type LayerZeroMessagesResponse = {
	data: LayerZeroMessage[]
	nextToken?: string
}

export type LayerZeroScanObservation = LayerZeroMessagesResponse & {
	observedBy: 'LayerZeroScan_Rest'
	resolvedAtMs: number
}
