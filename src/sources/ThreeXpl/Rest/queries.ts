/**
 * 3xpl JSON API query helpers.
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { threeXplGetJson } from '$/sources/ThreeXpl/Rest/client.ts'
import {
	threeXplAddressMonetaryResponseWire,
	threeXplAddressResponseWire,
	threeXplBlockResponseWire,
	threeXplBlocksResponseWire,
	threeXplGeneralInfoResponseWire,
	threeXplSearchResponseWire,
	threeXplTransactionResponseWire,
	type ThreeXplBlockchainSelector,
	type ThreeXplClientOptions,
	type ThreeXplLimit,
	type ThreeXplModuleSelector,
	type ThreeXplSearchEntity,
} from '$/sources/ThreeXpl/Rest/types.ts'


const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`ThreeXpl_Rest: invalid ${label} response envelope`)
	}
}

/**
 * Clamp a positive row limit to 3xpl's documented `limit` enum.
 */
export const threeXplListLimit = (
	limit: number
): Exclude<ThreeXplLimit, 'default'> => {
	if (!Number.isSafeInteger(limit) || limit < 1)
		throw new Error('ThreeXpl_Rest: limit must be a positive safe integer')
	if (limit <= 1) return 1
	if (limit <= 10) return 10
	if (limit <= 100) return 100
	return 1000
}

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
}) => (
	assertEnvelope(
		'chain stats',
		threeXplGeneralInfoResponseWire,
		await threeXplGetJson({
			searchParams: {
				from,
				mode,
				library,
			},
			options,
		})
	)
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
}) => (
	assertEnvelope(
		'search',
		threeXplSearchResponseWire,
		await threeXplGetJson({
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
}) => (
	assertEnvelope(
		'blocks',
		threeXplBlocksResponseWire,
		await threeXplGetJson({
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
}) => (
	assertEnvelope(
		'block',
		threeXplBlockResponseWire,
		await threeXplGetJson({
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
}) => (
	assertEnvelope(
		'transaction',
		threeXplTransactionResponseWire,
		await threeXplGetJson({
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
}) => (
	assertEnvelope(
		'address',
		threeXplAddressResponseWire,
		await threeXplGetJson({
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
}) => (
	assertEnvelope(
		'address monetary',
		threeXplAddressMonetaryResponseWire,
		await threeXplGetJson({
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
)
