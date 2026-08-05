export type QuilibriumImplicitAccountReference = {
	implicitAccount: {
		implicitType: number
		address: Uint8Array
	}
}

export type QuilibriumOriginatedAccountReference = {
	originatedAccount: {
		address: Uint8Array
	}
}

export type QuilibriumAccountReference =
	| QuilibriumOriginatedAccountReference
	| QuilibriumImplicitAccountReference

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

export type QuilibriumAccountAllowanceReference = {
	address: Uint8Array
}

export type QuilibriumCoinReference = {
	address: Uint8Array
}

export type QuilibriumPendingTransactionReference = {
	address: Uint8Array
}

export type QuilibriumCoinInfo = {
	coin: QuilibriumCoinReference
	balance: Uint8Array
}

export type QuilibriumPendingTransactionInfo = {
	pendingTransaction: QuilibriumPendingTransactionReference
	coin: QuilibriumCoinInfo
	refundAccount: QuilibriumAccountReference
}

export type QuilibriumBalanceAccountRequest = {
	account: QuilibriumAccountReference
	allowance?: QuilibriumAccountAllowanceReference
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
	account: QuilibriumAccountReference
	allowance?: QuilibriumAccountAllowanceReference
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
	}
) => Promise<_Response>
