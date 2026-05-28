import type { JsonValue } from '$/typescript/JsonValue.ts'

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

export type ThreeXplContext = {
	code?: number
	request_cost?: number
	api?: {
		version?: string
		notice?: string
	}
	time?: number
	limit?: number
	timestamp?: string
}

export type ThreeXplApiResponse<T> = {
	data: T
	context?: ThreeXplContext
	library?: ThreeXplLibraryData
	mixins?: ThreeXplMixins
}

export type ThreeXplCurrency = {
	name?: string
	type?: string
	symbol?: string
	decimals?: number
	description?: string | null
}

export type ThreeXplBlockchainInfo = {
	title?: string
	description?: string
	modules?: string[]
	native_currency?: string
	block_entity_name?: string
	transaction_entity_name?: string
	address_entity_name?: string
	mempool_entity_name?: string
	launch_date?: string
	is_testnet?: boolean
	transaction_broadcast_implemented?: boolean
}

export type ThreeXplModuleInfo = {
	title?: string
	description?: string
	mempool_implemented?: boolean
	forking_implemented?: boolean
	block_hash_format?: string
	transaction_hash_format?: string
	address_format?: string
	currency_format?: string
	currency_type?: string
	transaction_render_model?: string
	fee_render_model?: string
	extra_data_model?: string
	special_addresses?: string[]
	first_block_id?: number
	complements_module?: string | null
	blockchain?: string
	dumps_implemented?: boolean
	is_main?: boolean
	pruning_interval?: number | null
	extra_indexed_hint_entity?: string | null
	extra_indexed_hint_blockchain?: string | null
}

export type ThreeXplLibraryData = {
	blockchains?: Record<string, ThreeXplBlockchainInfo>
	modules?: Record<string, ThreeXplModuleInfo>
	currencies?: Record<string, ThreeXplCurrency> | ThreeXplCurrency[]
	rates?: Record<string, Record<string, string>>
	extras?: JsonValue[]
}

export type ThreeXplGeneralInfo = {
	best_block?: number
	best_block_hash?: string
	best_block_time?: string
	average_fee_24h?: Record<string, string>
	events_24h?: Record<string, number>
	mempool_events?: Record<string, number | null>
	progress?: Record<string, number>
}

export type ThreeXplGeneralInfoData = {
	blockchains?: Record<string, ThreeXplGeneralInfo>
}

export type ThreeXplStatsMixin = Record<string, {
	best_block?: number
	first_block?: number
}>

export type ThreeXplBlocksMixin = Record<string, ThreeXplBlockInfo>

export type ThreeXplMixins = {
	stats?: ThreeXplStatsMixin
	blocks?: ThreeXplBlocksMixin
}

export type ThreeXplBlockInfo = {
	block?: number
	hash?: string
	time?: string
	events?: Record<string, number>
}

export type ThreeXplBlocksData = {
	blocks?: Record<string, ThreeXplBlockInfo>
}

export type ThreeXplBlockData = {
	block?: ThreeXplBlockInfo
	events?: Record<string, ThreeXplBlockEvent[]>
}

export type ThreeXplCommonEvent = {
	sort_key?: number
	currency?: string
	currency_type?: string
	effect?: string
	failed?: boolean | null
	extra?: string | null
	extra_indexed?: string | null
}

export type ThreeXplBlockEvent = ThreeXplCommonEvent & {
	transaction?: string
	address?: string
}

export type ThreeXplTransactionInfo = {
	block?: number
	transaction?: string
	time?: string
	events?: Record<string, number>
}

export type ThreeXplTransactionEvent = ThreeXplCommonEvent & {
	address?: string
}

export type ThreeXplTransactionData = {
	transaction?: ThreeXplTransactionInfo
	events?: Record<string, ThreeXplTransactionEvent[]>
}

export type ThreeXplAddressGeneralInfo = {
	address?: string
	balances?: Record<string, number>
	events?: Record<string, number>
}

export type ThreeXplAddressBalance = {
	balance?: string
	events?: number
}

export type ThreeXplAddressEvent = ThreeXplCommonEvent & {
	block?: number
	transaction?: string
	time?: string
}

export type ThreeXplAddressData = {
	address?: ThreeXplAddressGeneralInfo
	balances?: Record<string, Record<string, ThreeXplAddressBalance>>
	events?: Record<string, ThreeXplAddressEvent[]>
	mempool?: Record<string, ThreeXplAddressEvent[]>
}

export type ThreeXplAddressMonetaryAmount = {
	value?: string
	currency?: string
}

export type ThreeXplAddressMonetaryData = {
	address?: ThreeXplAddressGeneralInfo
	balances?: Record<string, Record<string, ThreeXplAddressBalance & {
		monetary?: Record<string, ThreeXplAddressMonetaryAmount>
	}>>
	events?: Record<string, (ThreeXplAddressEvent & {
		monetary?: Record<string, ThreeXplAddressMonetaryAmount>
	})[]>
	period?: Record<string, JsonValue>
	period_dates?: {
		from?: string
		to?: string
	}
}

export type ThreeXplSearchResult = {
	blockchain?: string
	entity?: string
	value?: string
	score?: number
}

export type ThreeXplSearchData = {
	results?: ThreeXplSearchResult[]
}
