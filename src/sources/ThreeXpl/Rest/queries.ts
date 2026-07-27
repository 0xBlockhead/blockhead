/**
 * 3xpl JSON API query helpers.
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { threeXplGetJson } from '$/sources/ThreeXpl/Rest/client.ts'
import type {
	ThreeXplAddressData,
	ThreeXplAddressMonetaryData,
	ThreeXplApiResponse,
	ThreeXplBlockData,
	ThreeXplBlockchainSelector,
	ThreeXplBlocksData,
	ThreeXplClientOptions,
	ThreeXplGeneralInfoData,
	ThreeXplLimit,
	ThreeXplModuleSelector,
	ThreeXplSearchData,
	ThreeXplSearchEntity,
	ThreeXplTransactionData,
} from '$/sources/ThreeXpl/Rest/types.ts'

/**
 * `GET /` — ecosystem, blockchain, or module stats.
 * Include `library=blockchains,modules,rates(usd)` for metadata and market rates.
 */
export const fetchChainStats = async ({
	from,
	mode,
	library,
	options,
}: {
	from?: ThreeXplBlockchainSelector
	mode?: 'greedy' | 'non-greedy' | 'default'
	library?: string
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplGeneralInfoData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplGeneralInfoData>>({
		searchParams: {
			from,
			mode,
			library,
		},
		options,
	})
)

/**
 * `GET /search` — search blocks, transactions, and addresses.
 */
export const search = async ({
	query,
	from,
	in: entity,
	mixins,
	library,
	options,
}: {
	query: string
	from?: ThreeXplBlockchainSelector
	in?: ThreeXplSearchEntity
	mixins?: 'stats'
	library?: 'blockchains'
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplSearchData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplSearchData>>({
		pathSegments: [
			'search',
		],
		searchParams: {
			q: query,
			from,
			in: entity,
			mixins,
			library,
		},
		options,
	})
)

/**
 * `GET /{blockchain}/blocks` — recent or paged block summaries.
 */
export const fetchBlocks = async ({
	blockchain,
	from,
	limit,
	page,
	library,
	options,
}: {
	blockchain: string
	from?: ThreeXplModuleSelector
	limit?: ThreeXplLimit
	page?: string | number
	library?: string
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplBlocksData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplBlocksData>>({
		pathSegments: [
			blockchain,
			'blocks',
		],
		searchParams: {
			data: 'blocks',
			from,
			limit,
			page,
			library,
		},
		options,
	})
)

/**
 * `GET /{blockchain}/block/{block}` — block summary and module events.
 * Use `library=currencies` to include token/asset metadata for event currencies.
 */
export const fetchBlock = async ({
	blockchain,
	block,
	data = 'block,events',
	from,
	limit,
	page,
	mixins,
	library,
	options,
}: {
	blockchain: string
	block: string | number
	data?: 'block' | 'events' | 'block,events' | string
	from?: ThreeXplModuleSelector
	limit?: ThreeXplLimit
	page?: string | number
	mixins?: 'stats'
	library?: string
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplBlockData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplBlockData>>({
		pathSegments: [
			blockchain,
			'block',
			String(block),
		],
		searchParams: {
			data,
			from,
			limit,
			page,
			mixins,
			library,
		},
		options,
	})
)

/**
 * `GET /{blockchain}/transaction/{transaction}` — transaction summary and module events.
 * Use `library=currencies` to include token/asset metadata for event currencies.
 */
export const fetchTransaction = async ({
	blockchain,
	transaction,
	data = 'transaction,events',
	from,
	limit,
	page,
	mixins,
	library,
	options,
}: {
	blockchain: string
	transaction: string
	data?: 'transaction' | 'events' | 'transaction,events' | string
	from?: ThreeXplModuleSelector
	limit?: ThreeXplLimit
	page?: string | number
	mixins?: string
	library?: string
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplTransactionData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplTransactionData>>({
		pathSegments: [
			blockchain,
			'transaction',
			transaction,
		],
		searchParams: {
			data,
			from,
			limit,
			page,
			mixins,
			library,
		},
		options,
	})
)

/**
 * `GET /{blockchain}/address/{address}` — account/address summary, balances,
 * historical events, and mempool events. Balances and event currencies are the
 * documented token/asset surface; request `library=currencies` for metadata.
 */
export const fetchAddress = async ({
	blockchain,
	address,
	data = 'address,balances,events,mempool',
	from,
	limit,
	page,
	segment,
	mixins,
	library,
	options,
}: {
	blockchain: string
	address: string
	data?: 'address' | 'balances' | 'events' | 'mempool' | string
	from?: ThreeXplModuleSelector
	limit?: ThreeXplLimit
	page?: string | number
	segment?: string
	mixins?: 'stats'
	library?: string
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplAddressData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplAddressData>>({
		pathSegments: [
			blockchain,
			'address',
			address,
		],
		searchParams: {
			data,
			from,
			limit,
			page,
			segment,
			mixins,
			library,
		},
		options,
	})
)

/**
 * `GET /{blockchain}/address/{address}/monetary` — calculated monetary account
 * details where 3xpl supports them.
 */
export const fetchAddressMonetary = async ({
	blockchain,
	address,
	currency,
	from,
	to,
	filter,
	options,
}: {
	blockchain: string
	address: string
	currency?: string
	from?: string
	to?: string
	filter?: readonly string[]
	options?: ThreeXplClientOptions
}): Promise<ThreeXplApiResponse<ThreeXplAddressMonetaryData>> => (
	threeXplGetJson<ThreeXplApiResponse<ThreeXplAddressMonetaryData>>({
		pathSegments: [
			blockchain,
			'address',
			address,
			'monetary',
		],
		searchParams: {
			currency,
			from,
			to,
		},
		repeatedSearchParams: {
			'filter[]': filter,
		},
		options,
	})
)
