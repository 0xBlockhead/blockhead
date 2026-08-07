/**
 * 3xpl JSON API wire shapes (fail-closed arktype envelopes).
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { type as arktype } from 'arktype'


export type ThreeXplServer = 'sandbox' | 'production'

export type ThreeXplSearchParamScalar = string | number | boolean

export type ThreeXplSearchParamValue =
	| ThreeXplSearchParamScalar
	| null
	| undefined

export type ThreeXplClientOptions = {
	server?: ThreeXplServer
	token?: string
}

export type ThreeXplLimit =
	| 'default'
	| 1
	| 10
	| 100
	| 1000

export type ThreeXplBlockchainSelector =
	| 'all'
	| 'default'
	| string

export type ThreeXplModuleSelector =
	| 'all'
	| 'default'
	| string

export type ThreeXplSearchEntity =
	| 'all'
	| 'default'
	| 'block'
	| 'transaction'
	| 'address'


const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const nullableString = nonEmptyString.or(arktype('null'))
const nullableBoolean = arktype('boolean').or(arktype('null'))
const eventCountByModule = arktype('Record<string, number.integer >= 0 | null>')
const stringRecord = arktype('Record<string, string>')


export const threeXplContextWire = arktype({
	'code?': 'number.integer',
	'request_cost?': 'number',
	'api?': {
		'version?': 'string',
		'notice?': 'string',
	},
	'time?': 'number',
	'limit?': 'number.integer >= 0',
	'timestamp?': 'string',
})

export type ThreeXplContext = typeof threeXplContextWire.infer

export const threeXplCurrencyWire = arktype({
	'name?': 'string',
	'type?': 'string',
	'symbol?': 'string',
	'decimals?': 'number.integer >= 0',
	'description?': nullableString,
})

export type ThreeXplCurrency = typeof threeXplCurrencyWire.infer

export const threeXplBlockchainInfoWire = arktype({
	'title?': 'string',
	'description?': 'string',
	'modules?': 'string[]',
	'native_currency?': 'string',
	'block_entity_name?': 'string',
	'transaction_entity_name?': 'string',
	'address_entity_name?': 'string',
	'mempool_entity_name?': 'string',
	'launch_date?': 'string',
	'is_testnet?': 'boolean',
	'transaction_broadcast_implemented?': 'boolean',
})

export type ThreeXplBlockchainInfo = typeof threeXplBlockchainInfoWire.infer

export const threeXplModuleInfoWire = arktype({
	'title?': 'string',
	'description?': 'string',
	'mempool_implemented?': 'boolean',
	'forking_implemented?': 'boolean',
	'block_hash_format?': 'string',
	'transaction_hash_format?': 'string',
	'address_format?': 'string',
	'currency_format?': 'string',
	'currency_type?': 'string',
	'transaction_render_model?': 'string',
	'fee_render_model?': 'string',
	'extra_data_model?': 'string',
	'special_addresses?': 'string[]',
	'first_block_id?': unsignedSafe,
	'complements_module?': nullableString,
	'blockchain?': 'string',
	'dumps_implemented?': 'boolean',
	'is_main?': 'boolean',
	'pruning_interval?': unsignedSafe.or(arktype('null')),
	'extra_indexed_hint_entity?': nullableString,
	'extra_indexed_hint_blockchain?': nullableString,
})

export type ThreeXplModuleInfo = typeof threeXplModuleInfoWire.infer

export const threeXplLibraryDataWire = arktype({
	'blockchains?': {
		'[string]': threeXplBlockchainInfoWire,
	},
	'modules?': {
		'[string]': threeXplModuleInfoWire,
	},
	'currencies?': arktype({
		'[string]': threeXplCurrencyWire,
	}).or(threeXplCurrencyWire.array()),
	'rates?': {
		'[string]': stringRecord,
	},
	'extras?': 'unknown[]',
})

export type ThreeXplLibraryData = typeof threeXplLibraryDataWire.infer

export const threeXplGeneralInfoWire = arktype({
	'best_block?': unsignedSafe,
	'best_block_hash?': 'string',
	'best_block_time?': 'string',
	'average_fee_24h?': stringRecord,
	'events_24h?': 'Record<string, number>',
	'mempool_events?': 'Record<string, number | null>',
	'progress?': 'Record<string, number>',
})

export type ThreeXplGeneralInfo = typeof threeXplGeneralInfoWire.infer

export const threeXplGeneralInfoDataWire = arktype({
	'blockchains?': {
		'[string]': threeXplGeneralInfoWire,
	},
})

export type ThreeXplGeneralInfoData = typeof threeXplGeneralInfoDataWire.infer

export const threeXplStatsMixinWire = arktype({
	'[string]': {
		'best_block?': unsignedSafe,
		'first_block?': unsignedSafe,
	},
})

export type ThreeXplStatsMixin = typeof threeXplStatsMixinWire.infer

export const threeXplBlockInfoWire = arktype({
	'block?': unsignedSafe,
	'hash?': nullableString,
	'time?': nullableString,
	'events?': eventCountByModule,
})

export type ThreeXplBlockInfo = typeof threeXplBlockInfoWire.infer

export const threeXplBlocksListEntryWire = arktype({
	hash: nonEmptyString,
	'time?': nonEmptyString,
	'events?': eventCountByModule,
})

export type ThreeXplBlocksListEntry = typeof threeXplBlocksListEntryWire.infer

export const threeXplBlocksDataWire = arktype({
	'blocks?': {
		'[string]': threeXplBlocksListEntryWire,
	},
})

export type ThreeXplBlocksData = typeof threeXplBlocksDataWire.infer

export const threeXplBlocksMixinWire = arktype({
	'[string]': threeXplBlockInfoWire,
})

export type ThreeXplBlocksMixin = typeof threeXplBlocksMixinWire.infer

export const threeXplMixinsWire = arktype({
	'stats?': threeXplStatsMixinWire,
	'blocks?': threeXplBlocksMixinWire,
})

export type ThreeXplMixins = typeof threeXplMixinsWire.infer

export const threeXplCommonEventWire = arktype({
	'sort_key?': 'number.integer',
	'currency?': 'string',
	'currency_type?': 'string',
	'effect?': 'string',
	'failed?': nullableBoolean,
	'extra?': nullableString,
	'extra_indexed?': nullableString,
})

export const threeXplBlockEventWire = threeXplCommonEventWire.and(arktype({
	'transaction?': 'string',
	'address?': 'string',
}))

export type ThreeXplBlockEvent = typeof threeXplBlockEventWire.infer

export const threeXplBlockDataWire = arktype({
	'block?': threeXplBlockInfoWire,
	'events?': {
		'[string]': threeXplBlockEventWire.array(),
	},
})

export type ThreeXplBlockData = typeof threeXplBlockDataWire.infer

export const threeXplTransactionInfoWire = arktype({
	'block?': unsignedSafe,
	'transaction?': 'string',
	'time?': 'string',
	'events?': eventCountByModule,
})

export type ThreeXplTransactionInfo = typeof threeXplTransactionInfoWire.infer

export const threeXplTransactionEventWire = threeXplCommonEventWire.and(arktype({
	'address?': 'string',
}))

export type ThreeXplTransactionEvent = typeof threeXplTransactionEventWire.infer

export const threeXplTransactionDataWire = arktype({
	'transaction?': threeXplTransactionInfoWire,
	'events?': {
		'[string]': threeXplTransactionEventWire.array(),
	},
})

export type ThreeXplTransactionData = typeof threeXplTransactionDataWire.infer

export const threeXplAddressGeneralInfoWire = arktype({
	'address?': 'string',
	'balances?': 'Record<string, number>',
	'events?': 'Record<string, number>',
})

export type ThreeXplAddressGeneralInfo = typeof threeXplAddressGeneralInfoWire.infer

export const threeXplAddressBalanceWire = arktype({
	'balance?': 'string',
	'events?': 'number.integer >= 0',
})

export type ThreeXplAddressBalance = typeof threeXplAddressBalanceWire.infer

export const threeXplAddressEventWire = threeXplCommonEventWire.and(arktype({
	'block?': unsignedSafe,
	'transaction?': 'string',
	'time?': 'string',
}))

export type ThreeXplAddressEvent = typeof threeXplAddressEventWire.infer

export const threeXplAddressDataWire = arktype({
	'address?': threeXplAddressGeneralInfoWire,
	'balances?': {
		'[string]': {
			'[string]': threeXplAddressBalanceWire,
		},
	},
	'events?': {
		'[string]': threeXplAddressEventWire.array(),
	},
	'mempool?': {
		'[string]': threeXplAddressEventWire.array(),
	},
})

export type ThreeXplAddressData = typeof threeXplAddressDataWire.infer

export const threeXplAddressMonetaryAmountWire = arktype({
	'value?': 'string',
	'currency?': 'string',
})

export type ThreeXplAddressMonetaryAmount = typeof threeXplAddressMonetaryAmountWire.infer

export const threeXplAddressMonetaryDataWire = arktype({
	'address?': threeXplAddressGeneralInfoWire,
	'balances?': {
		'[string]': {
			'[string]': threeXplAddressBalanceWire.and(arktype({
				'monetary?': {
					'[string]': threeXplAddressMonetaryAmountWire,
				},
			})),
		},
	},
	'events?': {
		'[string]': threeXplAddressEventWire.and(arktype({
			'monetary?': {
				'[string]': threeXplAddressMonetaryAmountWire,
			},
		})).array(),
	},
	'period?': 'Record<string, unknown>',
	'period_dates?': {
		'from?': 'string',
		'to?': 'string',
	},
})

export type ThreeXplAddressMonetaryData = typeof threeXplAddressMonetaryDataWire.infer

/**
 * Live `/search` returns nested `results[blockchain][entity] = url`,
 * not a flat score list.
 */
export const threeXplSearchDataWire = arktype({
	'results?': {
		'[string]': stringRecord,
	},
})

export type ThreeXplSearchData = typeof threeXplSearchDataWire.infer

export type ThreeXplApiResponse<_Data> = {
	data: _Data
	context?: ThreeXplContext
	library?: ThreeXplLibraryData
	mixins?: ThreeXplMixins
}

const threeXplApiResponseWire = <_DataWire>(
	dataWire: _DataWire
) => (
	arktype({
		data: dataWire,
		'context?': threeXplContextWire,
		'library?': threeXplLibraryDataWire,
		'mixins?': threeXplMixinsWire,
	})
)

export const threeXplGeneralInfoResponseWire = threeXplApiResponseWire(threeXplGeneralInfoDataWire)
export const threeXplSearchResponseWire = threeXplApiResponseWire(threeXplSearchDataWire)
export const threeXplBlocksResponseWire = threeXplApiResponseWire(threeXplBlocksDataWire)
export const threeXplBlockResponseWire = threeXplApiResponseWire(threeXplBlockDataWire)
export const threeXplTransactionResponseWire = threeXplApiResponseWire(threeXplTransactionDataWire)
export const threeXplAddressResponseWire = threeXplApiResponseWire(threeXplAddressDataWire)
export const threeXplAddressMonetaryResponseWire = threeXplApiResponseWire(threeXplAddressMonetaryDataWire)

export type ThreeXplGeneralInfoResponse = typeof threeXplGeneralInfoResponseWire.infer
export type ThreeXplSearchResponse = typeof threeXplSearchResponseWire.infer
export type ThreeXplBlocksResponse = typeof threeXplBlocksResponseWire.infer
export type ThreeXplBlockResponse = typeof threeXplBlockResponseWire.infer
export type ThreeXplTransactionResponse = typeof threeXplTransactionResponseWire.infer
export type ThreeXplAddressResponse = typeof threeXplAddressResponseWire.infer
export type ThreeXplAddressMonetaryResponse = typeof threeXplAddressMonetaryResponseWire.infer
