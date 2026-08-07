import {
	type as arktype,
} from 'arktype'


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


const bytesWire = arktype.instanceOf(Uint8Array)

const accountReferenceWire = arktype({
	'implicitAccount?': {
		implicitType: 'number.integer >= 0',
		address: bytesWire,
	},
	'originatedAccount?': {
		address: bytesWire,
	},
}).narrow(
	(value, ctx) => (
		(
			('implicitAccount' in value) !== ('originatedAccount' in value)
		) || ctx.mustBe('exactly one of implicitAccount or originatedAccount')
	)
)

const coinInfoWire = arktype({
	coin: {
		address: bytesWire,
	},
	balance: bytesWire,
})

export const balanceAccountResponseWire = arktype({
	balance: bytesWire,
})

export type BalanceAccountResponseWire = typeof balanceAccountResponseWire.infer

export const pendingTransactionsAccountResponseWire = arktype({
	pendingTransactions: arktype({
		pendingTransaction: {
			address: bytesWire,
		},
		coin: coinInfoWire,
		refundAccount: accountReferenceWire,
	}).array(),
})

export type PendingTransactionsAccountResponseWire = typeof pendingTransactionsAccountResponseWire.infer


export const hexAddressFromBytes = (
	bytes: Uint8Array
) => (
	`0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
)

export const bigintFromBalanceBytes = (
	balance: Uint8Array
) => {
	if (balance.length === 0)
		return 0n

	return BigInt(
		`0x${Array.from(balance, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
	)
}

export const accountAddressFromAccountReference = (
	account: QuilibriumAccountReference
) => (
	'implicitAccount' in account ?
		hexAddressFromBytes(account.implicitAccount.address)
	:
		hexAddressFromBytes(account.originatedAccount.address)
)

export const accountKindFromAccountReference = (
	account: QuilibriumAccountReference
) => (
	'implicitAccount' in account ?
		'implicit'
	:
		'originated'
)
