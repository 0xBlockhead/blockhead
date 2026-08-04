import { type as arktype, type Type } from 'arktype'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	TzktBigMap,
	TzktBigMapKey,
	TzktBigMapUpdate,
	TzktBlock,
	TzktContract,
	TzktAccount,
	TzktHead,
	TzktOperation,
	TzktStatistics,
	TzktToken,
	TzktTokenBalance,
	TzktTokenTransfer,
} from '$/sources/Tzkt/Rest/types.ts'
import bindings from '$/sources/Tzkt/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Tzkt_Rest][0]
const baseUrl = firstHttpUrlForBinding(binding).replace(/\/$/, '')
const tzktBlock = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	hash: 'string',
	'cycle?': 'number.integer',
	'protocol?': 'string',
	'predecessor?': 'string',
	'payloadHash?': 'string',
	'operationsHash?': 'string',
	'blockRound?': 'number.integer >= 0',
	'baker?': {
		address: 'string',
		'alias?': 'string',
	},
	'fitness?': 'unknown',
}) satisfies Type<TzktBlock>
const tzktHead = arktype({
	chain: 'string',
	chainId: 'string',
	cycle: 'number.integer >= 0',
	level: 'number.integer >= 0',
	hash: 'string',
	protocol: 'string',
	timestamp: 'string',
	synced: 'boolean',
	'knownLevel?': 'number.integer >= 0',
}) satisfies Type<TzktHead>
const tzktStatistics = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	totalSupply: 'number.integer >= 0',
	'circulatingSupply?': 'number.integer >= 0',
}) satisfies Type<TzktStatistics>

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

export const getBigMap = ({
	bigMapId,
	level,
}: {
	bigMapId: bigint | number | string
	level?: bigint | number
}) => (
	sourceGetJson<TzktBigMap>(
		binding,
		`${baseUrl}/v1/bigmaps/${bigMapId}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`
	)
)

export const listBigMaps = ({
	contract,
	limit,
}: {
	contract?: string
	limit?: number
}) => (
	sourceGetJson<TzktBigMap[]>(
		binding,
		`${baseUrl}/v1/bigmaps?${queryString({
			contract,
			limit,
		})}`
	)
)

export const getBigMapKey = ({
	bigMapId,
	keyHash,
	level,
}: {
	bigMapId: bigint | number | string
	keyHash: string
	level?: bigint | number
}) => (
	sourceGetJson<TzktBigMapKey>(
		binding,
		`${baseUrl}/v1/bigmaps/${bigMapId}/keys/${keyHash}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`
	)
)

export const listBigMapKeys = ({
	bigMapId,
	limit,
}: {
	bigMapId: bigint | number | string
	limit?: number
}) => (
	sourceGetJson<TzktBigMapKey[]>(
		binding,
		`${baseUrl}/v1/bigmaps/${bigMapId}/keys?${queryString({
			limit,
		})}`
	)
)

export const listBigMapUpdates = ({
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
	sourceGetJson<TzktBigMapUpdate[]>(
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
)

export const getContract = ({
	address,
}: {
	address: string
}) => {
	assertNonemptyAddress(address, 'contract')
	return sourceGetJson<TzktContract>(
		binding,
		`${baseUrl}/v1/contracts/${encodeURIComponent(address)}`
	)
}

export const listContracts = ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'contract')
	return sourceGetJson<TzktContract[]>(
		binding,
		`${baseUrl}/v1/contracts?${queryString({
			offset,
			limit,
		})}`
	)
}

export const getAccount = ({
	address,
	level,
}: {
	address: string
	level?: bigint | number
}) => {
	assertNonemptyAddress(address, 'account')
	return sourceGetJson<TzktAccount>(
		binding,
		`${baseUrl}/v1/accounts/${encodeURIComponent(address)}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`
	)
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

	const operations = await sourceGetJson<TzktOperation[]>(
		binding,
		`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/operations?${queryString({
			offset,
			limit,
		})}`
	)
	if (operations.length > limit)
		throw new Error('TzKT account operations exceeded the requested limit')

	const operationIds = new Set<number>()
	for (const operation of operations) {
		if (
			!Number.isSafeInteger(operation.id)
			|| operation.id < 0
			|| !Number.isSafeInteger(operation.level)
			|| operation.level < 0
			|| operation.hash.length === 0
			|| operation.type.length === 0
			|| !Number.isSafeInteger(Date.parse(operation.timestamp))
		)
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

	const balances = await sourceGetJson<TzktTokenBalance[]>(
		binding,
		`${baseUrl}/v1/tokens/balances?${queryString({
			account: address,
			offset,
			limit,
		})}`
	)
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

	const transfers = await sourceGetJson<TzktTokenTransfer[]>(
		binding,
		`${baseUrl}/v1/tokens/transfers?${queryString({
			'anyof.from.to': address,
			offset,
			limit,
		})}`
	)
	if (transfers.length > limit)
		throw new Error('TzKT account token transfers exceeded the requested limit')

	return transfers
}

export const getBlock = ({
	level,
}: {
	level: bigint | number
}) => (
	sourceGetJson<unknown>(
		binding,
		`${baseUrl}/v1/blocks/${String(level)}`
	).then((wire) => tzktBlock.assert(wire))
)

export const listBlocks = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'block')
	const blocks = await sourceGetJson<unknown[]>(
		binding,
		`${baseUrl}/v1/blocks?${queryString({
			offset,
			limit,
			'sort.desc': 'level',
		})}`
	)
	if (blocks.length > limit)
		throw new Error('TzKT blocks exceeded the requested limit')

	return blocks.map((wire) => tzktBlock.assert(wire))
}

export const getHead = () => (
	sourceGetJson<unknown>(
		binding,
		`${baseUrl}/v1/head`
	).then((wire) => tzktHead.assert(wire))
)

export const getCurrentStatistics = () => (
	sourceGetJson<unknown>(
		binding,
		`${baseUrl}/v1/statistics/current`
	).then((wire) => tzktStatistics.assert(wire))
)

export const listOperationsByHash = ({
	operationHash,
}: {
	operationHash: string
}) => {
	if (operationHash.length === 0)
		throw new Error('TzKT operation hash must not be empty')

	return sourceGetJson<TzktOperation[]>(
		binding,
		`${baseUrl}/v1/operations/${encodeURIComponent(operationHash)}`
	)
}

export const listTokenTransfers = async ({
	offset,
	limit,
}: {
	offset: number
	limit: number
}) => {
	assertPage(offset, limit, 'token transfer')
	const transfers = await sourceGetJson<TzktTokenTransfer[]>(
		binding,
		`${baseUrl}/v1/tokens/transfers?${queryString({
			offset,
			limit,
		})}`
	)
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
	const tokens = await sourceGetJson<TzktToken[]>(
		binding,
		`${baseUrl}/v1/tokens?${queryString({
			offset,
			limit,
		})}`
	)
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
	const tokens = await sourceGetJson<TzktToken[]>(
		binding,
		`${baseUrl}/v1/tokens?${queryString({
			contract: contractAddress,
			tokenId: String(tokenId),
			limit: 1,
		})}`
	)
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
