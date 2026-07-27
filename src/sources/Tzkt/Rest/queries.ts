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
	TzktOperation,
	TzktTokenBalance,
	TzktTokenTransfer,
} from '$/sources/Tzkt/Rest/types.ts'
import bindings from '$/sources/Tzkt/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Tzkt_Rest]
const baseUrl = firstHttpUrlForBinding(binding).replace(/\/$/, '')
const tzktBlock = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	hash: 'string',
}) satisfies Type<TzktBlock>

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
}) => (
	sourceGetJson<TzktContract>(
		binding,
		`${baseUrl}/v1/contracts/${address}`
	)
)

export const getAccount = ({
	address,
}: {
	address: string
}) => {
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktAccount>(
		binding,
		`${baseUrl}/v1/accounts/${encodeURIComponent(address)}`
	)
}

const assertAccountPage = (
	offset: number,
	limit: number
) => {
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('TzKT account offset must be a nonnegative safe integer')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error('TzKT account limit must be a safe integer from 1 through 1000')
	if (!Number.isSafeInteger(offset + limit))
		throw new Error('TzKT account page must remain within safe integer bounds')
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
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

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

export const listAccountTokenBalances = ({
	address,
	offset,
	limit,
}: {
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktTokenBalance[]>(
		binding,
		`${baseUrl}/v1/tokens/balances?${queryString({
			account: address,
			offset,
			limit,
		})}`
	)
}

export const listAccountTokenTransfers = ({
	address,
	offset,
	limit,
}: {
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktTokenTransfer[]>(
		binding,
		`${baseUrl}/v1/tokens/transfers?${queryString({
			'anyof.from.to': address,
			offset,
			limit,
		})}`
	)
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

export const listOperationsByHash = ({
	operationHash,
}: {
	operationHash: string
}) => (
	sourceGetJson<TzktOperation[]>(
		binding,
		`${baseUrl}/v1/operations/${operationHash}`
	)
)
