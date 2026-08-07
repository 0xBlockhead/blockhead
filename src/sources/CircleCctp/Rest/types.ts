import { type as arktype } from 'arktype'


const domainIdWire = arktype('/^(0|[1-9]\\d*)$/')
const messageNonceWire = arktype('string > 0')
const addressWire = arktype('string > 0')
const zeroExHexWire = arktype('/^0x[0-9a-fA-F]*$/')
const transactionHashWire = arktype('/^0x[0-9a-fA-F]{64}$/')
const utcTimestampWire = arktype('string > 0')


export const circleCctpAttestationStatusWire = arktype(
	"'complete' | 'pending_confirmations'"
)

export const circleCctpDelayReasonWire = arktype(
	"'insufficient_fee' | 'amount_above_max' | 'insufficient_allowance_available' | null"
)

export const circleCctpCctpVersionWire = arktype('1 | 2')

export const circleCctpFinalityThresholdWire = arktype("'1000' | '2000'")

export const circleCctpDecodedMessageBodyWire = arktype({
	'burnToken?': addressWire,
	'mintRecipient?': addressWire,
	'amount?': 'string',
	'messageSender?': addressWire,
	'maxFee?': 'string',
	'feeExecuted?': 'string',
	'expirationBlock?': 'string',
	'hookData?': 'string',
}).or('null')

export const circleCctpDecodedMessageWire = arktype({
	'sourceDomain?': domainIdWire,
	'destinationDomain?': domainIdWire,
	'nonce?': messageNonceWire,
	'sender?': addressWire,
	'recipient?': addressWire,
	'destinationCaller?': addressWire,
	'minFinalityThreshold?': circleCctpFinalityThresholdWire,
	'finalityThresholdExecuted?': circleCctpFinalityThresholdWire,
	'messageBody?': 'string',
	'decodedMessageBody?': circleCctpDecodedMessageBodyWire,
}).or('null')

export const circleCctpMessageV2Wire = arktype({
	'message?': 'string',
	'eventNonce?': messageNonceWire,
	'attestation?': arktype('string').or('null'),
	'decodedMessage?': circleCctpDecodedMessageWire,
	'cctpVersion?': circleCctpCctpVersionWire,
	'status?': circleCctpAttestationStatusWire,
	'delayReason?': circleCctpDelayReasonWire,
	'forwardState?': 'string',
	'forwardTxHash?': transactionHashWire,
})

export const circleCctpMessagesV2ResponseWire = arktype({
	messages: circleCctpMessageV2Wire.array(),
	sourceTxHash: transactionHashWire,
})

export const circleCctpAttestationV1ResponseWire = arktype({
	'attestation?': arktype('string').or('null'),
	status: circleCctpAttestationStatusWire,
})

export const circleCctpPublicKeysV2ResponseWire = arktype({
	'publicKeys?': arktype({
		'publicKey?': 'string',
		'cctpVersion?': circleCctpCctpVersionWire,
	}).array(),
})

export const circleCctpBurnFeeForwardFeeWire = arktype({
	'low?': 'number.integer >= 0',
	'medium?': 'number.integer >= 0',
	'high?': 'number.integer >= 0',
})

export const circleCctpBurnFeeRowWire = arktype({
	finalityThreshold: 'number.integer >= 0',
	minimumFee: 'number >= 0',
	'forwardFee?': circleCctpBurnFeeForwardFeeWire,
})

export const circleCctpBurnFeesResponseWire = circleCctpBurnFeeRowWire.array()

export const circleCctpFastBurnAllowanceResponseWire = arktype({
	'allowance?': 'number >= 0',
	'lastUpdated?': utcTimestampWire,
})

export const circleCctpReattestationResponseWire = arktype({
	'message?': 'string',
	'nonce?': messageNonceWire,
})


export type CircleCctpAttestationStatus = typeof circleCctpAttestationStatusWire.infer
export type CircleCctpMessageV2 = typeof circleCctpMessageV2Wire.infer
export type CircleCctpMessagesV2Response = typeof circleCctpMessagesV2ResponseWire.infer
export type CircleCctpAttestationV1Response = typeof circleCctpAttestationV1ResponseWire.infer
export type CircleCctpBurnFeeRow = typeof circleCctpBurnFeeRowWire.infer
export type CircleCctpBurnFeesResponse = typeof circleCctpBurnFeesResponseWire.infer
export type CircleCctpFastBurnAllowanceResponse = typeof circleCctpFastBurnAllowanceResponseWire.infer
export type CircleCctpPublicKeysV2Response = typeof circleCctpPublicKeysV2ResponseWire.infer
export type CircleCctpReattestationResponse = typeof circleCctpReattestationResponseWire.infer

export type CircleCctpIrisResult<_Body> = {
	body: _Body
	requestId?: string
}
