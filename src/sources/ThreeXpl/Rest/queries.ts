/**
 * 3xpl JSON API query helpers.
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { threeXplGetJson } from '$/sources/ThreeXpl/Rest/client.ts'
import type {
	ThreeXplApiResponse,
	ThreeXplBlockData,
	ThreeXplBlockchainSelector,
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
export const fetchChainStats = ({
	from,
	mode,
	library,
	options,
}: {
	from?: ThreeXplBlockchainSelector
	mode?: 'greedy' | 'non-greedy' | 'default'
	library?: string
	options?: ThreeXplClientOptions
}) => (
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
export const search = ({
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
}) => (
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
 * `GET /{blockchain}/block/{block}` — block summary and module events.
 * Use `library=currencies` to include token/asset metadata for event currencies.
 */
export const fetchBlock = ({
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
}) => (
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
export const fetchTransaction = ({
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
}) => (
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
