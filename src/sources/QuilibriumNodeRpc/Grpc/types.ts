export type QuilibriumOriginatedAccountRef = {
	originatedAccount: {
		address: Uint8Array
	}
}

export type QuilibriumImplicitAccountRef = {
	implicitAccount: {
		implicitType: number
		address: Uint8Array
		domain?: Uint8Array
	}
}

export type QuilibriumAccountRef =
	| QuilibriumOriginatedAccountRef
	| QuilibriumImplicitAccountRef

export type QuilibriumKeyRing = {
	keys: {
		ref: Uint8Array
		key: Uint8Array
	}[]
}

export type QuilibriumDeliveryMethod = {
	deliveryType: number
	address?: Uint8Array
}

export type QuilibriumSignature = {
	signatureType: number
	signature: Uint8Array
	key: {
		address: Uint8Array
	}
}

export type QuilibriumAccountAllowanceRef = {
	address: Uint8Array
}

export type QuilibriumCoinRef = {
	address: Uint8Array
}

export type QuilibriumPendingTransactionRef = {
	address: Uint8Array
}

export type QuilibriumCoinInfo = {
	coin: QuilibriumCoinRef
	balance: Uint8Array
}

export type QuilibriumPendingTransactionInfo = {
	pendingTransaction: QuilibriumPendingTransactionRef
	coin: QuilibriumCoinInfo
	refundAccount: QuilibriumAccountRef
}

export type QuilibriumBalanceAccountRequest = {
	account: QuilibriumAccountRef
	allowance?: QuilibriumAccountAllowanceRef
	signature?: QuilibriumSignature
}

export type QuilibriumDecryptableBalanceAccountRequest = {
	request: QuilibriumBalanceAccountRequest
	keyRing: QuilibriumKeyRing
}

export type QuilibriumBalanceAccountResponse = {
	balance: Uint8Array
}

export type QuilibriumPendingTransactionsAccountRequest = {
	account: QuilibriumAccountRef
	allowance?: QuilibriumAccountAllowanceRef
	signature?: QuilibriumSignature
}

export type QuilibriumDecryptablePendingTransactionsAccountRequest = {
	request: QuilibriumPendingTransactionsAccountRequest
	keyRing: QuilibriumKeyRing
	deliveryMethod?: QuilibriumDeliveryMethod
}

export type QuilibriumPendingTransactionsAccountResponse = {
	pendingTransactions: QuilibriumPendingTransactionInfo[]
}

export type QuilibriumGrpcUnaryCall = <
	_Request,
	_Response,
>(
	call: {
		service: string
		method: string
		request: _Request
	},
) => Promise<_Response>
