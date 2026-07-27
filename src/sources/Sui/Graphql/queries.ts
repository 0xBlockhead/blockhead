import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import bindings from '$/sources/Sui/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	SuiGraphqlAddressBalances,
	SuiGraphqlAddressTransactions,
} from '$/sources/Sui/Graphql/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Sui_Graphql]

export const query = <_Data = JsonValue>(
	document: string,
	variables?: JsonValue
) => (
	graphql<_Data>({
		binding,
		query: document,
		variables,
	})
)

const addressBalancesQuery = `
	query SuiAddressBalances($address: SuiAddress!, $first: Int!, $after: String) {
		address(address: $address) {
			address
			balances(first: $first, after: $after) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					coinType {
						repr
					}
					totalBalance
					coinBalance
					addressBalance
				}
			}
		}
	}
`

const addressTransactionsQuery = `
	query SuiAddressTransactions($address: SuiAddress!, $first: Int!, $after: String) {
		address(address: $address) {
			address
		}
		transactions(
			first: $first
			after: $after
			filter: { affectedAddress: $address }
		) {
			pageInfo {
				hasNextPage
				endCursor
			}
			nodes {
				digest
				sender {
					address
				}
			}
		}
	}
`

export const normalizeSuiAddress = (address: string) => {
	const match = /^0x([0-9a-f]{1,64})$/i.exec(address)
	if (match == null)
		throw new Error('Sui GraphQL address must be a 0x-prefixed hexadecimal address')

	return `0x${match[1].toLowerCase().padStart(64, '0')}`
}

const assertPageRequest = ({
	address,
	limit,
	after,
}: {
	address: string
	limit: number
	after?: string
}) => {
	normalizeSuiAddress(address)
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 50)
		throw new Error('Sui GraphQL page limit must be a safe integer from 0 through 50')
	if (after === '')
		throw new Error('Sui GraphQL page cursor must not be empty')
}

const pagination = (
	limit: number,
	after: string | undefined,
	pageInfo: {
		hasNextPage: boolean
		endCursor: string | null
	}
) => {
	if (pageInfo.hasNextPage && (pageInfo.endCursor == null || pageInfo.endCursor === ''))
		throw new Error('Sui GraphQL page is missing its next cursor')
	if (pageInfo.hasNextPage && pageInfo.endCursor === after)
		throw new Error('Sui GraphQL page did not advance its cursor')

	return {
		limit,
		...(after != null && { after }),
		...(pageInfo.hasNextPage && {
			nextAfter: pageInfo.endCursor,
		}),
	}
}

export const getAddressBalances = async (
	{
		address,
		limit,
		after,
	}: {
		address: string
		limit: number
		after?: string
	}
) => {
	assertPageRequest({
		address,
		limit,
		after,
	})
	if (limit === 0)
		return {
			balances: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const canonicalAddress = normalizeSuiAddress(address)
	const result = await query<SuiGraphqlAddressBalances>(
		addressBalancesQuery,
		{
			address: canonicalAddress,
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result?.address == null)
		throw new Error(`Sui GraphQL address balances did not find ${address}`)
	if (normalizeSuiAddress(result.address.address) !== canonicalAddress)
		throw new Error(`Sui GraphQL address balances returned a mismatched address for ${address}`)
	if (result.address.balances.nodes.length > limit)
		throw new Error('Sui GraphQL address balances exceeded the requested limit')

	const coinTypes = new Set<string>()
	for (const balance of result.address.balances.nodes) {
		if (balance.coinType.repr.length === 0)
			throw new Error('Sui GraphQL address balances returned an empty coin type')
		if (coinTypes.has(balance.coinType.repr))
			throw new Error('Sui GraphQL address balances returned a duplicate coin type')
		for (const amount of [
			balance.totalBalance,
			balance.coinBalance,
			balance.addressBalance,
		]) {
			try {
				if (BigInt(amount) < 0n)
					throw new Error('negative')
			}
			catch {
				throw new Error('Sui GraphQL address balances returned an invalid amount')
			}
		}

		coinTypes.add(balance.coinType.repr)
	}

	return {
		balances: result.address.balances.nodes,
		pagination: pagination(
			limit,
			after,
			result.address.balances.pageInfo
		),
	}
}

export const getAddressTransactions = async (
	{
		address,
		limit,
		after,
	}: {
		address: string
		limit: number
		after?: string
	}
) => {
	assertPageRequest({
		address,
		limit,
		after,
	})
	if (limit === 0)
		return {
			transactions: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const canonicalAddress = normalizeSuiAddress(address)
	const result = await query<SuiGraphqlAddressTransactions>(
		addressTransactionsQuery,
		{
			address: canonicalAddress,
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result?.address == null)
		throw new Error(`Sui GraphQL address transactions did not find ${address}`)
	if (normalizeSuiAddress(result.address.address) !== canonicalAddress)
		throw new Error(`Sui GraphQL address transactions returned a mismatched address for ${address}`)
	if (result.transactions.nodes.length > limit)
		throw new Error('Sui GraphQL address transactions exceeded the requested limit')

	const digests = new Set<string>()
	for (const transaction of result.transactions.nodes) {
		if (transaction.digest.length === 0)
			throw new Error('Sui GraphQL address transactions returned an empty digest')
		if (digests.has(transaction.digest))
			throw new Error('Sui GraphQL address transactions returned a duplicate digest')
		if (transaction.sender != null)
			normalizeSuiAddress(transaction.sender.address)

		digests.add(transaction.digest)
	}

	return {
		transactions: result.transactions.nodes,
		pagination: pagination(
			limit,
			after,
			result.transactions.pageInfo
		),
	}
}
