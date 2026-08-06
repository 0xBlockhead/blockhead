/**
 * Safe Transaction Service REST wire envelopes (fail-closed arktype).
 * @see https://docs.safe.global/core-api/transaction-service-overview
 */
import { type as arktype } from 'arktype'


const safeAddress = arktype('string').matching(/^0x[0-9a-fA-F]{40}$/)
const safeHash = arktype('string').matching(/^0x[0-9a-fA-F]{64}$/)
const safeHexData = arktype('string').matching(/^0x[0-9a-fA-F]*$/)
const safeUnsignedDecimal = arktype('string').matching(/^(0|[1-9][0-9]*)$/)
const safeIsoTimestamp = arktype('string > 0')
const safeNullableHash = safeHash.or(arktype('null'))
const safeNullableAddress = safeAddress.or(arktype('null'))
const safeNullableString = arktype('string').or(arktype('null'))
const safeNullableIsoTimestamp = safeIsoTimestamp.or(arktype('null'))
const safeNullableBoolean = arktype('boolean').or(arktype('null'))
const safeNullableBlockNumber = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`).or(arktype('null'))
const safeThreshold = arktype('number.integer >= 1 <= 1000')
const safeOperation = arktype('0 | 1')

export const safeStatusEnvelope = arktype({
	address: safeAddress,
	nonce: safeUnsignedDecimal,
	threshold: safeThreshold,
	owners: safeAddress.array(),
	masterCopy: safeAddress,
	modules: safeAddress.array(),
	fallbackHandler: safeAddress,
	guard: safeAddress,
	'moduleGuard?': safeAddress,
	version: safeNullableString,
})

export type SafeStatus = typeof safeStatusEnvelope.infer

export const safeMultisigConfirmationEnvelope = arktype({
	owner: safeAddress,
	submissionDate: safeIsoTimestamp,
	transactionHash: safeNullableHash,
	signature: arktype('string').matching(/^0x[0-9a-fA-F]+$/),
	signatureType: 'string > 0',
})

export type SafeMultisigConfirmation = typeof safeMultisigConfirmationEnvelope.infer

export const safeMultisigTransactionEnvelope = arktype({
	safe: safeAddress,
	to: safeAddress,
	value: safeUnsignedDecimal,
	data: safeHexData.or(arktype('null')),
	operation: safeOperation,
	safeTxGas: safeUnsignedDecimal,
	baseGas: safeUnsignedDecimal,
	gasPrice: safeUnsignedDecimal,
	gasToken: safeAddress,
	refundReceiver: safeAddress,
	nonce: safeUnsignedDecimal,
	executionDate: safeNullableIsoTimestamp,
	submissionDate: safeIsoTimestamp,
	modified: safeIsoTimestamp,
	blockNumber: safeNullableBlockNumber,
	transactionHash: safeNullableHash,
	safeTxHash: safeHash,
	proposer: safeNullableAddress,
	executor: safeNullableAddress,
	isExecuted: 'boolean',
	isSuccessful: safeNullableBoolean,
	confirmationsRequired: safeThreshold,
	confirmations: safeMultisigConfirmationEnvelope.array(),
	trusted: 'boolean',
	signatures: safeNullableString,
})

export type SafeMultisigTransaction = typeof safeMultisigTransactionEnvelope.infer

export const safeCreationEnvelope = arktype({
	created: safeIsoTimestamp,
	creator: safeAddress,
	transactionHash: safeHash,
	factoryAddress: safeAddress,
	masterCopy: safeAddress,
})

export type SafeCreation = typeof safeCreationEnvelope.infer

export const safeMultisigTransactionPageEnvelope = arktype({
	count: arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`),
	next: arktype('string').or(arktype('null')),
	previous: arktype('string').or(arktype('null')),
	results: safeMultisigTransactionEnvelope.array(),
})

export type SafeMultisigTransactionPage = typeof safeMultisigTransactionPageEnvelope.infer

export const safeMultisigConfirmationPageEnvelope = arktype({
	count: arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`),
	next: arktype('string').or(arktype('null')),
	previous: arktype('string').or(arktype('null')),
	results: safeMultisigConfirmationEnvelope.array(),
})

export type SafeMultisigConfirmationPage = typeof safeMultisigConfirmationPageEnvelope.infer

/** @deprecated Prefer typed page envelopes; kept for call-site generics. */
export type SafePage<_Result> = {
	count: number
	next: string | null
	previous: string | null
	results: _Result[]
}
