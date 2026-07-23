import { type as arktype, type Type } from 'arktype'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
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

const tzktBlock = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	hash: 'string',
}) satisfies Type<TzktBlock>

const base = (binding: SourceBinding) => {
	if (
		binding.provider !== SourceProvider.Tzkt
		|| binding.source !== Source.Tzkt_Rest
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'tezos:NetXdQprcVkpaWU'
		|| binding.wireProtocol !== WireProtocol.HttpRest
		|| binding.apiFamily !== ApiFamily.RestJson
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericRead)
		|| binding.delivery !== SourceDelivery.HttpProxy
		|| binding.proxyId == null
		|| binding.credentials.length !== 1
		|| binding.credentials[0]?.scope !== SourceCredentialScope.None
		|| binding.endpoints.length !== 1
		|| binding.endpoints[0]?.endpointKind !== SourceEndpointKind.HttpUrl
		|| binding.endpoints[0].locator !== 'https://api.tzkt.io'
		|| binding.endpoints[0].origin !== 'https://api.tzkt.io'
		|| binding.endpoints[0].corsEnabled !== false
	)
		throw new Error('Tzkt_Rest: canonical Tezos mainnet source binding is malformed')

	return firstHttpUrlForBinding(binding).replace(/\/$/, '')
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

export const getBigMap = ({
	binding,
	bigMapId,
	level,
}: {
	binding: SourceBinding
	bigMapId: bigint | number | string
	level?: bigint | number
}) => (
	sourceGetJson<TzktBigMap>(
		binding,
		`${base(binding)}/v1/bigmaps/${bigMapId}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`
	)
)

export const listBigMaps = ({
	binding,
	contract,
	limit,
}: {
	binding: SourceBinding
	contract?: string
	limit?: number
}) => (
	sourceGetJson<TzktBigMap[]>(
		binding,
		`${base(binding)}/v1/bigmaps?${queryString({
			contract,
			limit,
		})}`
	)
)

export const getBigMapKey = ({
	binding,
	bigMapId,
	keyHash,
	level,
}: {
	binding: SourceBinding
	bigMapId: bigint | number | string
	keyHash: string
	level?: bigint | number
}) => (
	sourceGetJson<TzktBigMapKey>(
		binding,
		`${base(binding)}/v1/bigmaps/${bigMapId}/keys/${keyHash}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`
	)
)

export const listBigMapKeys = ({
	binding,
	bigMapId,
	limit,
}: {
	binding: SourceBinding
	bigMapId: bigint | number | string
	limit?: number
}) => (
	sourceGetJson<TzktBigMapKey[]>(
		binding,
		`${base(binding)}/v1/bigmaps/${bigMapId}/keys?${queryString({
			limit,
		})}`
	)
)

export const listBigMapUpdates = ({
	binding,
	bigMapId,
	keyHash,
	level,
	limit,
}: {
	binding: SourceBinding
	bigMapId?: bigint | number | string
	keyHash?: string
	level?: bigint | number
	limit?: number
}) => (
	sourceGetJson<TzktBigMapUpdate[]>(
		binding,
		keyHash == null ?
			`${base(binding)}/v1/bigmaps/updates?${queryString({
				bigmap: bigMapId == null ? undefined : String(bigMapId),
				level: level == null ? undefined : String(level),
				limit,
			})}`
		:
			`${base(binding)}/v1/bigmaps/${bigMapId}/keys/${keyHash}/updates?${queryString({
				limit,
			})}`
	)
)

export const getContract = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	sourceGetJson<TzktContract>(
		binding,
		`${base(binding)}/v1/contracts/${address}`
	)
)

export const getAccount = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => {
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktAccount>(
		binding,
		`${base(binding)}/v1/accounts/${encodeURIComponent(address)}`
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
	binding,
	address,
	offset,
	limit,
}: {
	binding: SourceBinding
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	const operations = await sourceGetJson<TzktOperation[]>(
		binding,
		`${base(binding)}/v1/accounts/${encodeURIComponent(address)}/operations?${queryString({
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
	binding,
	address,
	offset,
	limit,
}: {
	binding: SourceBinding
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktTokenBalance[]>(
		binding,
		`${base(binding)}/v1/tokens/balances?${queryString({
			account: address,
			offset,
			limit,
		})}`
	)
}

export const listAccountTokenTransfers = ({
	binding,
	address,
	offset,
	limit,
}: {
	binding: SourceBinding
	address: string
	offset: number
	limit: number
}) => {
	assertAccountPage(offset, limit)
	if (address.length === 0)
		throw new Error('TzKT account address must not be empty')

	return sourceGetJson<TzktTokenTransfer[]>(
		binding,
		`${base(binding)}/v1/tokens/transfers?${queryString({
			'anyof.from.to': address,
			offset,
			limit,
		})}`
	)
}

export const getBlock = ({
	binding,
	level,
}: {
	binding: SourceBinding
	level: bigint | number
}) => (
	sourceGetJson<unknown>(
		binding,
		`${base(binding)}/v1/blocks/${String(level)}`
	).then((wire) => tzktBlock.assert(wire))
)

export const listOperationsByHash = ({
	binding,
	operationHash,
}: {
	binding: SourceBinding
	operationHash: string
}) => (
	sourceGetJson<TzktOperation[]>(
		binding,
		`${base(binding)}/v1/operations/${operationHash}`
	)
)
