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
const safeNonNegativeInteger = arktype('number.integer').atLeast(0).atMost(Number.MAX_SAFE_INTEGER)
const safeNullableBlockNumber = safeNonNegativeInteger.or(arktype('null'))
const safeThreshold = arktype('number.integer').atLeast(1).atMost(1000)
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
	/** Transport leftover — Safe 1.4+ module guard; no enrolled `$moduleGuard` field. */
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

/** Deprecated decoder bag — transport-only; product uses Safe Decoder Service when needed. */
const safeDataDecodedEnvelope = arktype({
	'method?': 'string',
	'parameters?': arktype('unknown').array(),
})

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
	/** Transport leftover — delegate that proposed; unenrolled beside proposer. */
	'proposedByDelegate?': safeNullableAddress,
	executor: safeNullableAddress,
	isExecuted: 'boolean',
	isSuccessful: safeNullableBoolean,
	/** Execution fee leftovers — unenrolled on EvmTransaction from this source. */
	'ethGasPrice?': safeUnsignedDecimal.or(arktype('null')),
	'maxFeePerGas?': safeUnsignedDecimal.or(arktype('null')),
	'maxPriorityFeePerGas?': safeUnsignedDecimal.or(arktype('null')),
	'gasUsed?': safeNullableBlockNumber,
	'fee?': safeUnsignedDecimal.or(arktype('null')),
	'payment?': safeUnsignedDecimal.or(arktype('null')),
	/**
	 * Client origin label (often a URL/JSON string, historically an address).
	 * Transport-only — do not freestyle an enrolled origin field from this surface.
	 */
	'origin?': arktype('string').or(arktype('null')),
	'dataDecoded?': safeDataDecodedEnvelope.or(arktype('null')),
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
	/** Transport leftovers — setup calldata / decoder bag; factory stays unenrolled. */
	'setupData?': safeHexData.or(arktype('null')),
	'dataDecoded?': safeDataDecodedEnvelope.or(arktype('null')),
})

export type SafeCreation = typeof safeCreationEnvelope.infer

export const safeMultisigTransactionPageEnvelope = arktype({
	count: safeNonNegativeInteger,
	/** Distinct Safe nonce count on the filtered page window — transport leftover (not `count`). */
	'countUniqueNonce?': safeNonNegativeInteger,
	next: arktype('string').or(arktype('null')),
	previous: arktype('string').or(arktype('null')),
	results: safeMultisigTransactionEnvelope.array(),
})

export type SafeMultisigTransactionPage = typeof safeMultisigTransactionPageEnvelope.infer

export const safeMultisigConfirmationPageEnvelope = arktype({
	count: safeNonNegativeInteger,
	next: arktype('string').or(arktype('null')),
	previous: arktype('string').or(arktype('null')),
	results: safeMultisigConfirmationEnvelope.array(),
})

export type SafeMultisigConfirmationPage = typeof safeMultisigConfirmationPageEnvelope.infer
