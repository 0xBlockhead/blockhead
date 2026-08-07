import { type as arktype } from 'arktype'

/**
 * LayerZero Scan `/v1/messages/*` wire shapes used by BridgeTransfer resolvers.
 * @see https://docs.layerzero.network/v2/tools/layerzeroscan/api
 * @see https://scan.layerzero-api.com/v1/openapi
 */

const nonnegativeIntegerString = arktype('/^(?:0|[1-9]\\d*)$/')
const bytes32String = arktype('/^0x[0-9a-fA-F]{64}$/')

export const layerZeroPathwayActorEnvelope = arktype({
	address: 'string > 0',
	'id?': 'string',
	'name?': 'string',
	'chain?': 'string',
})

export const layerZeroSourceTransactionEnvelope = arktype({
	txHash: 'string > 0',
	'blockHash?': 'string',
	blockNumber: nonnegativeIntegerString,
	blockTimestamp: 'number.integer >= 0',
	'from?': 'string',
	'blockConfirmations?': 'number.integer >= 0',
	'payload?': 'string',
	'value?': nonnegativeIntegerString,
	'readinessTimestamp?': 'number.integer >= 0',
	'resolvedPayload?': 'string',
	'options?': {
		'lzReceive?': {
			'gas?': nonnegativeIntegerString,
			'value?': nonnegativeIntegerString,
		},
		'nativeDrop?': arktype({
			'amount?': nonnegativeIntegerString,
			'receiver?': 'string',
		}).array(),
		'compose?': arktype({
			'index?': 'number.integer >= 0',
			'gas?': nonnegativeIntegerString,
			'value?': nonnegativeIntegerString,
		}).array(),
		'ordered?': 'boolean',
	},
})

export const layerZeroDestinationTransactionEnvelope = arktype({
	txHash: 'string > 0',
	'blockHash?': 'string',
	blockNumber: 'number.integer >= 0',
	blockTimestamp: 'number.integer >= 0',
})

export const layerZeroMessageStatusEnvelope = arktype({
	name: 'string > 0',
	'message?': 'string',
})

export const layerZeroUlnConfigEnvelope = arktype({
	'confirmations?': 'number.integer >= 0',
	'requiredDVNCount?': 'number.integer >= 0',
	'optionalDVNCount?': 'number.integer >= 0',
	'optionalDVNThreshold?': 'number.integer >= 0',
	'requiredDVNs?': 'string[]',
	'requiredDVNNames?': 'string[]',
	'optionalDVNs?': 'string[]',
	'optionalDVNNames?': 'string[]',
	'executor?': 'string',
})

export const layerZeroLegacyConfigEnvelope = arktype({
	'blockConfirmation?': 'number.integer >= 0',
	'relayerAddress?': 'string',
	'oracleAddress?': 'string',
	'inboundProofLibraryVersion?': 'number.integer >= 0',
	'outboundProofType?': 'number.integer >= 0',
})

export const layerZeroMessageConfigEnvelope = arktype({
	'error?': 'boolean',
	'errorMessage?': 'string',
	'dvnConfigError?': 'boolean',
	'receiveLibrary?': arktype('string').or('null'),
	'sendLibrary?': arktype('string').or('null'),
	'ulnSendVersion?': 'string',
	'ulnReceiveVersion?': 'string',
	'outboundConfig?': layerZeroUlnConfigEnvelope.or(layerZeroLegacyConfigEnvelope),
	'inboundConfig?': layerZeroUlnConfigEnvelope.or(layerZeroLegacyConfigEnvelope),
})

export const layerZeroMessageEnvelope = arktype({
	pathway: {
		srcEid: 'number.integer >= 1',
		dstEid: 'number.integer >= 1',
		sender: layerZeroPathwayActorEnvelope,
		receiver: layerZeroPathwayActorEnvelope,
		id: 'string > 0',
		nonce: 'number.integer >= 0',
	},
	source: {
		'status?': 'string',
		tx: layerZeroSourceTransactionEnvelope,
		'failedTx?': 'string[]',
	},
	'destination?': {
		'status?': 'string',
		'tx?': layerZeroDestinationTransactionEnvelope,
		'nativeDrop?': 'Record<string, unknown>',
		'lzCompose?': 'Record<string, unknown>',
		'nilify?': 'Record<string, unknown>',
		'burn?': 'Record<string, unknown>',
		'skip?': 'Record<string, unknown>',
		'payloadStoredTx?': 'string',
		'failedTx?': 'unknown[]',
	},
	'verification?': 'Record<string, unknown>',
	guid: bytes32String,
	'config?': layerZeroMessageConfigEnvelope,
	status: layerZeroMessageStatusEnvelope,
	created: 'string > 0',
	updated: 'string > 0',
})

export const layerZeroMessagesResponseEnvelope = arktype({
	data: layerZeroMessageEnvelope.array(),
	'nextToken?': 'string',
})

export type LayerZeroMessage = typeof layerZeroMessageEnvelope.infer
export type LayerZeroMessagesResponse = typeof layerZeroMessagesResponseEnvelope.infer
export type LayerZeroSourceTransaction = LayerZeroMessage['source']['tx']
export type LayerZeroDestinationTransaction = NonNullable<
	NonNullable<LayerZeroMessage['destination']>['tx']
>
