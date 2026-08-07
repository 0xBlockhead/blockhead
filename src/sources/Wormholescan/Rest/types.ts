import { type as arktype } from 'arktype'
import type { components } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'

/**
 * Wormholescan operation / VAA wire shapes used by BridgeTransfer and WormholeVaa resolvers.
 * Live `/api/v1/vaas/...` documents carry `sequence` and base64 `vaa` bytes;
 * OpenAPI `vaa.VaaDoc` omits `sequence` and types `vaa` as `number[]`.
 */

const nonnegativeIntegerString = arktype('/^(?:0|[1-9]\\d*)$/')
const emitterHexString = arktype('/^[0-9a-fA-F]{1,128}$/')
const operationSequenceString = arktype('/^[0-9a-fA-F]+(?:-\\d+)?$/')
const nonNegativeDecimalString = arktype('/^(?:0|[1-9]\\d*)(?:\\.\\d+)?$/')

export const wormholescanTransactionEnvelope = arktype({
	'txHash?': 'string',
	'secondTxHash?': 'string',
})

export const wormholescanSourceChainEnvelope = arktype({
	'chainId?': 'number.integer >= 0',
	'status?': 'string',
	'timestamp?': 'string',
	'from?': 'string',
	'fee?': 'string',
	'feeUSD?': 'string',
	'gasTokenNotional?': 'string',
	'isSolanaShim?': 'boolean',
	'transaction?': wormholescanTransactionEnvelope,
	'balanceChanges?': 'unknown[]',
	'attribute?': 'Record<string, unknown>',
})

export const wormholescanTargetChainEnvelope = arktype({
	'chainId?': 'number.integer >= 0',
	'status?': 'string',
	'timestamp?': 'string',
	'from?': 'string',
	'to?': 'string',
	'fee?': 'string',
	'feeUSD?': 'string',
	'gasTokenNotional?': 'string',
	'transaction?': wormholescanTransactionEnvelope,
	'balanceChanges?': 'unknown[]',
})

export const wormholescanStandardizedPropertiesEnvelope = arktype({
	'amount?': 'string',
	'appIds?': 'string[]',
	'fee?': 'string',
	'feeAddress?': 'string',
	'feeChain?': 'number.integer >= 0',
	'fromAddress?': 'string',
	'fromChain?': 'number.integer >= 0',
	'normalizedDecimals?': 'number.integer >= 0',
	'toAddress?': 'string',
	'toChain?': 'number.integer >= 0',
	'tokenAddress?': 'string',
	'tokenChain?': 'number.integer >= 0',
})

export const wormholescanOperationContentEnvelope = arktype({
	'standarizedProperties?': wormholescanStandardizedPropertiesEnvelope,
	'payload?': 'Record<string, unknown>',
})

export const wormholescanEmitterAddressEnvelope = arktype({
	hex: emitterHexString,
	'native?': 'string',
})

export const wormholescanOperationEnvelope = arktype({
	id: 'string > 0',
	emitterChain: 'number.integer >= 0',
	emitterAddress: wormholescanEmitterAddressEnvelope,
	sequence: operationSequenceString,
	'content?': wormholescanOperationContentEnvelope,
	'sourceChain?': wormholescanSourceChainEnvelope,
	'targetChain?': wormholescanTargetChainEnvelope,
	'vaa?': {
		'guardianSetIndex?': 'number.integer >= 0',
		'isDuplicated?': 'boolean',
		'raw?': 'number.integer[]',
	},
	'data?': 'Record<string, unknown>',
})

export const wormholescanOperationsPageEnvelope = arktype({
	operations: wormholescanOperationEnvelope.array(),
})

export const wormholescanVaaEnvelope = arktype({
	id: 'string > 0',
	emitterChain: 'number.integer >= 0',
	emitterAddr: emitterHexString,
	sequence: nonnegativeIntegerString.or('number.integer >= 0'),
	timestamp: 'string > 0',
	vaa: arktype('string > 0').or('number.integer[]'),
	'digest?': 'string',
	'guardianSetIndex?': 'number.integer >= 0',
	'emitterNativeAddr?': 'string',
	'txHash?': 'string',
	'indexedAt?': 'string',
	'updatedAt?': 'string',
	'isDuplicated?': 'boolean',
	'isSolanaShim?': 'boolean',
	'version?': 'number.integer >= 0',
	'payload?': 'Record<string, unknown>',
})

export const wormholescanVaaByIdResponseEnvelope = arktype({
	data: wormholescanVaaEnvelope,
	pagination: {
		next: 'string',
	},
})

export const wormholescanNonNegativeDecimalString = nonNegativeDecimalString

export type WormholescanOperation = typeof wormholescanOperationEnvelope.infer
export type WormholescanOperationsPage = typeof wormholescanOperationsPageEnvelope.infer
export type WormholescanVaa = typeof wormholescanVaaEnvelope.infer
export type WormholescanVaaByIdResponse = typeof wormholescanVaaByIdResponseEnvelope.infer
export type WormholescanWormholeChainId = components['schemas']['vaa.ChainID']
