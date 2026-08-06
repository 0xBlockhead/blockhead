import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	tzktAccount,
	tzktBigMap,
	tzktBigMapKey,
	tzktBigMapUpdate,
	tzktBlock,
	tzktContract,
	tzktHead,
	tzktOperation,
	tzktStatistics,
	tzktToken,
	tzktTokenBalance,
	tzktTokenTransfer,
	type TzktAccount,
	type TzktBigMap,
	type TzktBigMapKey,
	type TzktBigMapUpdate,
	type TzktBlock,
	type TzktContract,
	type TzktHead,
	type TzktOperation,
	type TzktStatistics,
	type TzktToken,
	type TzktTokenBalance,
	type TzktTokenTransfer,
} from '$/sources/Tzkt/Rest/types.ts'
import bindings from '$/sources/Tzkt/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Tzkt_Rest][0]
const baseUrl = firstHttpUrlForBinding(binding).replace(/\/$/, '')

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
		throw new Error(`Tzkt_Rest: invalid ${label} response envelope`)
	}
}

const assertEnvelopeArray = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	if (!Array.isArray(response))
		throw new Error(`Tzkt_Rest: invalid ${label} response envelope`)
	return response.map((row) => assertEnvelope(label, wire, row))
}

const queryString = (parameters: Record<string, string | number | undefined>) => (
	Object.entries(parameters)
		.flatMap(([key, value]) => (
			value == null ?
				[]
			:
				[[
					key,
					String(value),
				]]
		))
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&')
)

const assertPage = (
	offset: number,
	limit: number,
	label: string
) => {
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`TzKT ${label} offset must be a nonnegative safe integer`)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error(`TzKT ${label} limit must be a safe integer from 1 through 1000`)
	if (!Number.isSafeInteger(offset + limit))
		throw new Error(`TzKT ${label} page must remain within safe integer bounds`)
}

const assertNonemptyAddress = (
	address: string,
	label: string
) => {
	if (address.length === 0)
		throw new Error(`TzKT ${label} address must not be empty`)
}

export const getBigMap = async ({
	bigMapId,
	level,
}: {
	bigMapId: bigint | number | string
	level?: bigint | number
}) => (
	assertEnvelope(
		'bigmap',
		tzktBigMap,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/bigmaps/${bigMapId}${(
				level == null ?
					''
				:
					`?${queryString({ level: String(level) })}`
			)}`
		)
	) as TzktBigMap
)

export const listBigMaps = async ({
	contract,
	limit,
}: {
	contract?: string
	limit?: number
}) => (
	assertEnvelopeArray(
		'bigmap',
		tzktBigMap,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/bigmaps?${queryString({
				contract,
				limit,
			})}`
		)
	) as TzktBigMap[]
)

export const getBigMapKey = async ({
	bigMapId,
	keyHash,
	level,
}: {
	bigMapId: bigint | number | string
	keyHash: string
	level?: bigint | number
}) => (
	assertEnvelope(
		'bigmap key',
		tzktBigMapKey,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/bigmaps/${bigMapId}/keys/${keyHash}${(
				level == null ?
					''
				:
					`?${queryString({ level: String(level) })}`
			)}`
		)
	) as TzktBigMapKey
)

export const listBigMapKeys = async ({
	bigMapId,
	limit,
}: {
	bigMapId: bigint | number | string
	limit?: number
}) => (
	assertEnvelopeArray(
		'bigmap key',
		tzktBigMapKey,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/bigmaps/${bigMapId}/keys?${queryString({
				limit,
			})}`
		)
	) as TzktBigMapKey[]
)

export const listBigMapUpdates = async ({
	bigMapId,
	keyHash,
	level,
	limit,
}: {
	bigMapId?: bigint | number | string
	keyHash?: string
	level?: bigint | number
	limit?: number
}) => (
	assertEnvelopeArray(
		'bigmap update',
		tzktBigMapUpdate,
		await sourceGetJson<unknown>(
			binding,
			keyHash == null ?
				`${baseUrl}/v1/bigmaps/updates?${queryString({
					bigmap: bigMapId == null ? undefined : String(bigMapId),
					level: level == null ? undefined : String(level),
					limit,
				})}`
			:
				`${baseUrl}/v1/bigmaps/${bigMapId}/keys/${keyHash}/updates?${queryString({
					limit,
				})}`
		)
	) as TzktBigMapUpdate[]
)

export const getContract = async ({
	address,
}: {
	address: string
}) => {
	assertNonemptyAddress(address, 'contract')
	return assertEnvelope(
		'contract',
		tzktContract,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/contracts/${encodeURIComponent(address)}`
		)
	) as TzktContract
}

export const listContracts = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'contract')
	const contracts = assertEnvelopeArray(
		'contract',
		tzktContract,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/contracts?${queryString({
				offset,
				limit,
			})}`
		)
	) as TzktContract[]
	if (contracts.length > limit)
		throw new Error('TzKT contracts exceeded the requested limit')
	return contracts
}

export const getAccount = async ({
	address,
	level,
}: {
	address: string
	level?: bigint | number
}) => {
	assertNonemptyAddress(address, 'account')
	return assertEnvelope(
		'account',
		tzktAccount,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/accounts/${encodeURIComponent(address)}${(
				level == null ?
					''
				:
					`?${queryString({ level: String(level) })}`
			)}`
		)
	) as TzktAccount
}

const assertAccountPage = (
	offset: number,
	limit: number
) => {
	assertPage(offset, limit, 'account')
}

export const listAccountOperations = async ({
	address,
	offset,
	limit,
}: {
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	assertNonemptyAddress(address, 'account')

	const operations = assertEnvelopeArray(
		'operation',
		tzktOperation,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/operations?${queryString({
				offset,
				limit,
			})}`
		)
	) as TzktOperation[]
	if (operations.length > limit)
		throw new Error('TzKT account operations exceeded the requested limit')

	const operationIds = new Set<number>()
	for (const operation of operations) {
		if (!Number.isSafeInteger(Date.parse(operation.timestamp)))
			throw new Error('TzKT account operations returned a malformed identity')
		if (
			operation.initiator?.address !== address
			&& operation.sender?.address !== address
			&& operation.target?.address !== address
		)
			throw new Error('TzKT account operations returned a foreign row')
		if (operationIds.has(operation.id))
			throw new Error('TzKT account operations returned a duplicate identity')

		operationIds.add(operation.id)
	}

	return operations
}

export const listAccountTokenBalances = async ({
	address,
	offset,
	limit,
}: {
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	assertNonemptyAddress(address, 'account')

	const balances = assertEnvelopeArray(
		'token balance',
		tzktTokenBalance,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/tokens/balances?${queryString({
				account: address,
				offset,
				limit,
			})}`
		)
	) as TzktTokenBalance[]
	if (balances.length > limit)
		throw new Error('TzKT account token balances exceeded the requested limit')

	return balances
}

export const listAccountTokenTransfers = async ({
	address,
	offset,
	limit,
}: {
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	assertNonemptyAddress(address, 'account')

	const transfers = assertEnvelopeArray(
		'token transfer',
		tzktTokenTransfer,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/tokens/transfers?${queryString({
				'anyof.from.to': address,
				offset,
				limit,
			})}`
		)
	) as TzktTokenTransfer[]
	if (transfers.length > limit)
		throw new Error('TzKT account token transfers exceeded the requested limit')

	return transfers
}

export const getBlock = async ({
	level,
}: {
	level: bigint | number
}) => (
	assertEnvelope(
		'block',
		tzktBlock,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/blocks/${String(level)}`
		)
	) as TzktBlock
)

export const listBlocks = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'block')
	const blocks = assertEnvelopeArray(
		'block',
		tzktBlock,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/blocks?${queryString({
				offset,
				limit,
				'sort.desc': 'level',
			})}`
		)
	) as TzktBlock[]
	if (blocks.length > limit)
		throw new Error('TzKT blocks exceeded the requested limit')

	return blocks
}

export const getHead = async () => (
	assertEnvelope(
		'head',
		tzktHead,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/head`
		)
	) as TzktHead
)

export const getCurrentStatistics = async () => (
	assertEnvelope(
		'statistics',
		tzktStatistics,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/statistics/current`
		)
	) as TzktStatistics
)

export const listOperationsByHash = async ({
	operationHash,
}: {
	operationHash: string
}) => {
	if (operationHash.length === 0)
		throw new Error('TzKT operation hash must not be empty')

	return assertEnvelopeArray(
		'operation',
		tzktOperation,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/operations/${encodeURIComponent(operationHash)}`
		)
	) as TzktOperation[]
}

export const listTokenTransfers = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'token transfer')
	const transfers = assertEnvelopeArray(
		'token transfer',
		tzktTokenTransfer,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/tokens/transfers?${queryString({
				offset,
				limit,
			})}`
		)
	) as TzktTokenTransfer[]
	if (transfers.length > limit)
		throw new Error('TzKT token transfers exceeded the requested limit')

	return transfers
}

export const listTokens = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'token')
	const tokens = assertEnvelopeArray(
		'token',
		tzktToken,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/tokens?${queryString({
				offset,
				limit,
			})}`
		)
	) as TzktToken[]
	if (tokens.length > limit)
		throw new Error('TzKT tokens exceeded the requested limit')

	return tokens
}

export const getToken = async ({
	contractAddress,
	tokenId,
}: {
	contractAddress: string
	tokenId: bigint | number | string
}) => {
	assertNonemptyAddress(contractAddress, 'token contract')
	const tokens = assertEnvelopeArray(
		'token',
		tzktToken,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/v1/tokens?${queryString({
				contract: contractAddress,
				tokenId: String(tokenId),
				limit: 1,
			})}`
		)
	) as TzktToken[]
	const token = tokens[0]
	if (token == null)
		throw new Error(`TzKT token ${contractAddress}/${String(tokenId)} not found`)
	if (
		token.contract.address !== contractAddress
		|| token.tokenId !== String(tokenId)
	)
		throw new Error(`TzKT token response does not match ${contractAddress}/${String(tokenId)}`)

	return token
}
