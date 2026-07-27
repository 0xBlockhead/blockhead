export type SafeStatus = {
	address: string
	nonce: string
	threshold: number
	owners: string[]
	masterCopy: string
	modules: string[]
	fallbackHandler: string
	guard: string
	moduleGuard?: string
	version: string | null
}

export type SafeMultisigConfirmation = {
	owner: string
	submissionDate: string
	transactionHash: string | null
	signature: string
	signatureType: string
}

export type SafeMultisigTransaction = {
	safe: string
	to: string
	value: string
	data: string | null
	operation: number
	safeTxGas: string
	baseGas: string
	gasPrice: string
	gasToken: string
	refundReceiver: string
	nonce: string
	executionDate: string | null
	submissionDate: string
	modified: string
	blockNumber: number | null
	transactionHash: string | null
	safeTxHash: string
	proposer: string | null
	executor: string | null
	isExecuted: boolean
	isSuccessful: boolean | null
	confirmationsRequired: number
	confirmations: SafeMultisigConfirmation[]
	trusted: boolean
	signatures: string | null
}

export type SafePage<_Result> = {
	count: number
	next: string | null
	previous: string | null
	results: _Result[]
}
