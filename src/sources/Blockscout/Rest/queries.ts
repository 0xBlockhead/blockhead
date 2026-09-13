/**
 * Blockscout REST v2 reads and the Blockscout-hosted execution RPC facade.
 * @see https://docs.blockscout.com/devs/apis/rest
 * @see https://docs.blockscout.com/devs/apis/rpc/eth-rpc
 */
import { type as arktype } from 'arktype'
import { throwIfHttpNotOk } from '$/lib/http.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Blockscout/bindings.ts'
import {
	getBlockscoutJson,
	getBlockscoutResponse,
} from '$/sources/Blockscout/Rest/client.ts'
import { blockscoutV2ItemsCountMax } from '$/sources/Blockscout/Rest/constants.ts'
import {
	blockscoutAddressTokensPageEnvelope,
	blockscoutBlockDetailEnvelope,
	blockscoutBlocksPageEnvelope,
	blockscoutCoinBalanceHistoryPageEnvelope,
	blockscoutCursorEnvelope,
	blockscoutRawTraceEnvelope,
	blockscoutTransactionStateChangesPageEnvelope,
	blockscoutTokenBalancesEnvelope,
	blockscoutTokenTransfersPageEnvelope,
	blockscoutTransactionEnvelope,
	blockscoutTransactionsPageEnvelope,
} from '$/sources/Blockscout/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceOperationGroup,
} from '$/sources/SourceBinding.ts'
import type {
	BlockscoutAddressCounters,
	BlockscoutAddressDetails,
	BlockscoutAddressInternalTransactionsPage,
	BlockscoutAddressTokenBalances,
	BlockscoutAddressTokenTransfersPage,
	BlockscoutAddressTokensPage,
	BlockscoutAddressTransactionsPage,
	BlockscoutCoinBalance,
	BlockscoutCoinBalanceHistoryPage,
	BlockscoutBlockDetails,
	BlockscoutBlocksPage,
	BlockscoutBlockTransactionsPage,
	BlockscoutRawTrace,
	BlockscoutErc4337Account,
	BlockscoutErc4337AccountsPage,
	BlockscoutErc4337AccountFactory,
	BlockscoutErc4337Bundler,
	BlockscoutErc4337Paymaster,
	BlockscoutSmartContract,
	BlockscoutSmartContractForList,
	BlockscoutSmartContractsPage,
	BlockscoutStats,
	BlockscoutStateChange,
	BlockscoutTokenBalance,
	BlockscoutTokenTransfersPage,
	BlockscoutTransaction,
	BlockscoutTransactionInternalTransactionsPage,
	BlockscoutTransactionLogsPage,
	BlockscoutTransactionStateChangesPage,
	BlockscoutTransactionsPage,
	BlockscoutTransactionTokenTransfersPage,
	BlockscoutUserOperationDetail,
	BlockscoutUserOperationsPage,
} from '$/sources/Blockscout/Rest/types.ts'

const bindingByApiFamilyAndChainId = new Map(
	bindings[Source.Blockscout_Rest].map((binding) => [
		`${binding.apiFamily}:${binding.target.key}`,
		binding,
	] as const)
)
const requireBlockscoutBinding = (chainId: number, apiFamily: ApiFamily) => {
	const binding = bindingByApiFamilyAndChainId.get(`${apiFamily}:${chainId}`)
	if (binding == null)
		throw new Error(`Blockscout_Rest: no ${apiFamily} binding for chain ${chainId}`)

	return binding
}

export const blockscoutGenericReadChainIds = bindings[Source.Blockscout_Rest].flatMap((binding) => (
	binding.operationGroups.some((operationGroup) => operationGroup === SourceOperationGroup.GenericRead) ?
		[Number(binding.target.key)]
	:
		[]
))
export const blockscoutAccountAbstractionChainIds = new Set(
	bindings[Source.Blockscout_Rest].flatMap((binding) => (
		binding.operationGroups.some((operationGroup) => operationGroup === SourceOperationGroup.BlockscoutAccountAbstraction) ?
			[Number(binding.target.key)]
		:
			[]
	))
)

const validatedBlockscoutTransactionWire = (wire: BlockscoutTransaction) => {
	blockscoutTransactionHash(wire.hash, 'transaction')
	if (
		wire.created_contract != null
		&& hexLowerOfByteSize(wire.created_contract.hash, 20) == null
	) throw new Error('Blockscout_Rest: invalid transaction created contract')

	for (const quantity of [
		wire.gas_limit,
		wire.gas_price,
		wire.max_fee_per_gas,
		wire.max_priority_fee_per_gas,
		wire.max_fee_per_blob_gas,
		wire.blob_gas_used,
		wire.gas_used,
	])
		if (quantity != null && quantity !== '')
			BigInt(quantity)

	for (const authorization of wire.authorization_list ?? []) {
		BigInt(authorization.nonce)
		BigInt(authorization.r)
		BigInt(authorization.s)
		if (!Number.isSafeInteger(authorization.chain_id) || authorization.chain_id < 0)
			throw new Error('Blockscout_Rest: invalid authorization chain_id')
		if (!Number.isSafeInteger(authorization.v) || authorization.v < 0)
			throw new Error('Blockscout_Rest: invalid authorization y_parity')
	}

	if (wire.block_number != null && (!Number.isSafeInteger(wire.block_number) || wire.block_number < 0))
		throw new Error('Blockscout_Rest: invalid transaction block_number')
	if (wire.position != null && (!Number.isSafeInteger(wire.position) || wire.position < 0))
		throw new Error('Blockscout_Rest: invalid transaction position')

	return wire
}
const validatedBlockscoutBlockWire = (wire: BlockscoutBlockDetails) => {
	blockscoutTimestampMs(wire.timestamp, 'block')

	if (!Number.isSafeInteger(wire.height) || wire.height < 0)
		throw new Error('Blockscout_Rest: invalid block height')

	for (const quantity of [
		wire.gas_used,
		wire.gas_limit,
		wire.base_fee_per_gas,
		wire.blob_gas_used,
		wire.excess_blob_gas,
	])
		if (quantity != null && quantity !== '')
			BigInt(quantity)

	return wire
}
const validatedBlockscoutTokenBalanceWire = (wire: BlockscoutTokenBalance) => {
	BigInt(wire.value)
	if (wire.token_id != null && wire.token_id !== '')
		BigInt(wire.token_id)
	if (wire.token != null) {
		const address = hexLowerOfByteSize(wire.token.address_hash, 20)
		if (address == null)
			throw new Error('Blockscout_Rest: invalid token balance token address')
		wire.token.address_hash = address
	}
	return wire
}
const blockscoutItemsCount = (limit: number) => Math.min(
	Math.max(Number.isFinite(limit) ? limit : 0, 0),
	blockscoutV2ItemsCountMax
)
const assertBlockscoutEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`Blockscout_Rest: invalid ${label} response envelope`)
	}
}

const blockscoutTimestampMs = (timestamp: string, label: string) => {
	const ms = Date.parse(timestamp)
	if (!Number.isFinite(ms) || ms < 0)
		throw new Error(`Blockscout_Rest: invalid ${label} timestamp`)

	return ms
}

const blockscoutPageEnvelope = arktype({
	items: 'unknown[]',
	'next_page_params?': blockscoutCursorEnvelope.or(arktype.null),
})

const blockscoutListContinuation = (
	token: string | undefined,
	label: string
) => {
	if (token == null)
		return undefined

	try {
		return blockscoutCursorEnvelope.assert(JSON.parse(token))
	} catch {
		throw new Error(`Blockscout_Rest: invalid ${label} continuation`)
	}
}

const blockscoutListRequest = ({
	limit,
	continuation,
	label,
}: {
	limit: number
	continuation?: string
	label: string
}) => {
	const requestedContinuation = blockscoutListContinuation(continuation, label)
	return {
		requestedContinuation,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
			...Object.fromEntries(
				Object.entries(requestedContinuation ?? {}).flatMap(([key, value]) => (
					value == null ?
						[]
					:
						[[key, value]]
				))
			),
		},
	}
}

const blockscoutErc4337ListRequest = ({
	limit,
	continuation,
	label,
}: {
	limit: number
	continuation?: string
	label: string
}) => {
	const requestedContinuation = blockscoutListContinuation(continuation, label)
	return {
		requestedContinuation,
		searchParams: {
			page_size: blockscoutItemsCount(limit),
			...Object.fromEntries(
				Object.entries(requestedContinuation ?? {}).flatMap(([key, value]) => (
					value == null ?
						[]
					:
						[[key, value]]
				))
			),
		},
	}
}

const blockscoutListPage = <Item>(
	items: Item[],
	nextPageParams: unknown,
	requestedContinuation: typeof blockscoutCursorEnvelope.infer | undefined,
	label: string
) => {
	const cursor = (
		nextPageParams == null ?
			undefined
		:
			blockscoutCursorEnvelope.assert(nextPageParams)
	)
	if (
		requestedContinuation != null
		&& JSON.stringify(cursor) === JSON.stringify(requestedContinuation)
	)
		throw new Error(`Blockscout_Rest: ${label} continuation did not advance`)

	return {
		items,
		nextPageParams: cursor,
	}
}

const blockscoutAddressHash = (value: string, label: string) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`Blockscout_Rest: invalid ${label} address`)

	return normalized
}

const blockscoutTransactionHash = (value: string, label: string) => {
	const normalized = hexLowerOfByteSize(value, 32)
	if (normalized == null)
		throw new Error(`Blockscout_Rest: invalid ${label} transaction hash`)

	return normalized
}

const blockscoutStateChangeAmount = (
	value: string | null | undefined,
	label: string
) => {
	if (value == null || value === '')
		return undefined

	try {
		return BigInt(value)
	} catch {
		throw new Error(`Blockscout_Rest: invalid state change ${label}`)
	}
}

export const blockscoutStateChangeKey = (stateChange: BlockscoutStateChange) => {
	const accountAddress = blockscoutAddressHash(stateChange.address.hash, 'state change account')
	blockscoutStateChangeAmount(stateChange.balance_before, 'balance before')
	blockscoutStateChangeAmount(stateChange.balance_after, 'balance after')
	blockscoutStateChangeAmount(stateChange.change, 'delta')

	if (stateChange.type === 'coin') {
		if (stateChange.token != null || stateChange.token_id != null)
			throw new Error('Blockscout_Rest: coin state change unexpectedly includes token identity')

		return `coin-${accountAddress}`
	}

	if (stateChange.token == null)
		throw new Error('Blockscout_Rest: token state change is missing token identity')

	const tokenAddress = blockscoutAddressHash(stateChange.token.address, 'state change token')
	const tokenId = blockscoutStateChangeAmount(stateChange.token_id, 'token ID')
	return `token-${tokenAddress}-${tokenId?.toString() ?? 'all'}-${accountAddress}`
}

/**
 * Optional aggregate stats are not enabled by every Blockscout deployment.
 * @see https://docs.blockscout.com/devs/apis/rest/stats-api
 */
export const getStats = async ({ chainId }: {
	chainId: number
}) => {
	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/stats',
	})
	if (response.status === 404 || response.status === 501)
		return null
	await throwIfHttpNotOk(response, response.url)

	return response.json<BlockscoutStats>()
}

export const getBlockByNumber = async ({ chainId, blockNumber }: {
	chainId: number
	blockNumber: bigint
}) => {
	const block = await getBlockscoutJson<BlockscoutBlockDetails>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/blocks/${blockNumber}`,
	})
	assertBlockscoutEnvelope(blockscoutBlockDetailEnvelope, block, 'block detail')
	if (String(block.height) !== blockNumber.toString())
		throw new Error('Blockscout_Rest: block response does not match the requested block number')

	return validatedBlockscoutBlockWire(block)
}

export const getBlocks = async ({
	chainId,
	limit,
	continuation,
}: {
	chainId: number
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'blocks')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'blocks',
	})
	const wire = await getBlockscoutJson<BlockscoutBlocksPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/blocks',
		searchParams,
	})
	assertBlockscoutEnvelope(blockscoutBlocksPageEnvelope, wire, 'blocks')

	const seenHeights = new Set<number>()
	let previousHeight: number | undefined
	return blockscoutListPage(
		wire.items.map((block) => {
			blockscoutTimestampMs(block.timestamp, 'block list item')

			if (!Number.isSafeInteger(block.height) || block.height < 0)
				throw new Error('Blockscout_Rest: invalid blocks list item height')

			if (previousHeight != null && block.height >= previousHeight)
				throw new Error('Blockscout_Rest: blocks are not in descending height order')

			previousHeight = block.height

			if (seenHeights.has(block.height))
				throw new Error('Blockscout_Rest: blocks contain duplicate identities')

			seenHeights.add(block.height)
			return block
		}),
		wire.next_page_params,
		requestedContinuation,
		'blocks'
	)
}

export const getBlockTransactions = async ({
	chainId,
	blockNumber,
	limit,
	continuation,
}: {
	chainId: number
	blockNumber: bigint
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'block transactions')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'block transactions',
	})
	const wire = await getBlockscoutJson<BlockscoutBlockTransactionsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/blocks/${blockNumber}/transactions`,
		searchParams,
	})
	assertBlockscoutEnvelope(blockscoutTransactionsPageEnvelope, wire, 'block transactions')

	const seen = new Set<`0x${string}`>()
	return blockscoutListPage(
		wire.items.map((transaction) => {
			if (transaction.block_number == null || String(transaction.block_number) !== blockNumber.toString())
				throw new Error('Blockscout_Rest: block transaction block_number does not match the requested block')

			const hash = blockscoutTransactionHash(transaction.hash, 'block transaction')
			if (seen.has(hash))
				throw new Error('Blockscout_Rest: block transactions contain duplicate identities')

			seen.add(hash)
			return validatedBlockscoutTransactionWire(transaction)
		}),
		wire.next_page_params,
		requestedContinuation,
		'block transactions'
	)
}

export const getTransactionByHash = async ({ chainId, txHash }: {
	chainId: number
	txHash: string
}) => {
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return null

	const wire = await getBlockscoutJson<BlockscoutTransaction>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/transactions/${normalized}`,
	})
	assertBlockscoutEnvelope(blockscoutTransactionEnvelope, wire, 'transaction detail')

	const returnedHash = blockscoutTransactionHash(wire.hash, 'transaction detail')
	if (returnedHash !== normalized)
		throw new Error('Blockscout_Rest: transaction response does not match the requested hash')

	return validatedBlockscoutTransactionWire(wire)
}

export const getTransactionRawTrace = async ({ chainId, txHash }: {
	chainId: number
	txHash: string
}) => {
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const wire = await getBlockscoutJson<BlockscoutRawTrace>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/transactions/${normalized}/raw-trace`,
	})
	assertBlockscoutEnvelope(blockscoutRawTraceEnvelope, wire, 'transaction raw trace')

	const traceAddresses = new Set<string>()
	const childCountByParentTraceAddress = new Map<string, number>()
	for (const trace of wire) {
		if (!Number.isSafeInteger(trace.subtraces) || trace.subtraces < 0)
			throw new Error('Blockscout_Rest: invalid transaction raw trace subtraces')
		BigInt(trace.action.gas)
		BigInt(trace.action.value)
		if (trace.result != null)
			BigInt(trace.result.gasUsed)
		for (const index of trace.traceAddress)
			if (!Number.isSafeInteger(index) || index < 0)
				throw new Error('Blockscout_Rest: invalid transaction raw trace address')

		if (trace.transactionHash != null && blockscoutTransactionHash(trace.transactionHash, 'transaction raw trace') !== normalized)
			throw new Error('Blockscout_Rest: transaction raw trace does not match the requested transaction hash')

		const traceAddress = trace.traceAddress.length === 0 ? 'root' : trace.traceAddress.join('.')
		if (traceAddresses.has(traceAddress))
			throw new Error('Blockscout_Rest: transaction raw trace contains duplicate identities')

		traceAddresses.add(traceAddress)
		if (trace.traceAddress.length > 0) {
			const parentTraceAddress = trace.traceAddress.slice(0, -1).join('.') || 'root'
			childCountByParentTraceAddress.set(
				parentTraceAddress,
				(childCountByParentTraceAddress.get(parentTraceAddress) ?? 0) + 1
			)
		}
	}
	for (const trace of wire) {
		const traceAddress = trace.traceAddress.length === 0 ? 'root' : trace.traceAddress.join('.')
		if (trace.traceAddress.length > 0 && !traceAddresses.has(trace.traceAddress.slice(0, -1).join('.') || 'root'))
			throw new Error(`Blockscout_Rest: transaction raw trace parent missing for ${traceAddress}`)

		if ((childCountByParentTraceAddress.get(traceAddress) ?? 0) !== trace.subtraces)
			throw new Error(`Blockscout_Rest: transaction raw trace subtraces do not match children for ${traceAddress}`)
	}

	return wire
}

export const getTransactions = async ({
	chainId,
	limit,
	continuation,
}: {
	chainId: number
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'transactions')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'transactions',
	})
	const wire = await getBlockscoutJson<BlockscoutTransactionsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/transactions',
		searchParams,
	})
	assertBlockscoutEnvelope(blockscoutTransactionsPageEnvelope, wire, 'transactions')

	const seen = new Set<`0x${string}`>()
	return blockscoutListPage(
		wire.items.map((transaction) => {
			const hash = blockscoutTransactionHash(transaction.hash, 'network transaction')
			if (seen.has(hash))
				throw new Error('Blockscout_Rest: transactions contain duplicate identities')

			seen.add(hash)
			return validatedBlockscoutTransactionWire(transaction)
		}),
		wire.next_page_params,
		requestedContinuation,
		'transactions'
	)
}

export const getAddressTransactions = async ({
	chainId,
	address,
	limit,
	continuation,
}: {
	chainId: number
	address: `0x${string}`
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'address transactions')

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return blockscoutListPage([], undefined, undefined, 'address transactions')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'address transactions',
	})
	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/transactions`,
		searchParams,
	})
	if (response.status === 404)
		return blockscoutListPage([], undefined, requestedContinuation, 'address transactions')
	await throwIfHttpNotOk(response, response.url)
	const wire = await response.json<BlockscoutAddressTransactionsPage>()
	assertBlockscoutEnvelope(blockscoutTransactionsPageEnvelope, wire, 'address transactions')

	const seen = new Set<`0x${string}`>()
	return blockscoutListPage(
		wire.items.map((transaction) => {
			const from = hexLowerOfByteSize(transaction.from.hash, 20) ?? ''
			const to = hexLowerOfByteSize(transaction.to?.hash ?? '', 20) ?? ''
			if (from !== normalized && to !== normalized)
				throw new Error('Blockscout_Rest: address transaction does not match the requested address')

			const hash = blockscoutTransactionHash(transaction.hash, 'address transaction')
			if (seen.has(hash))
				throw new Error('Blockscout_Rest: address transactions contain duplicate identities')

			seen.add(hash)
			return validatedBlockscoutTransactionWire(transaction)
		}),
		wire.next_page_params,
		requestedContinuation,
		'address transactions'
	)
}

export const getAddressDetails = ({ chainId, address }: {
	chainId: number
	address: `0x${string}`
}) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address detail: invalid address')

	return getBlockscoutJson<BlockscoutAddressDetails>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}`,
	})
}

export const getAddressCounters = ({ chainId, address }: {
	chainId: number
	address: `0x${string}`
}) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address counters: invalid address')

	return getBlockscoutJson<BlockscoutAddressCounters>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/counters`,
	})
}

export const getAddressTokenTransfers = async ({
	chainId,
	address,
	limit,
	continuation,
}: {
	chainId: number
	address: `0x${string}`
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'address token transfers')

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return blockscoutListPage([], undefined, undefined, 'address token transfers')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'address token transfers',
	})
	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/token-transfers`,
		searchParams,
	})
	if (response.status === 404)
		return blockscoutListPage([], undefined, requestedContinuation, 'address token transfers')
	await throwIfHttpNotOk(response, response.url)
	const wire = await response.json<BlockscoutAddressTokenTransfersPage>()
	assertBlockscoutEnvelope(blockscoutTokenTransfersPageEnvelope, wire, 'address token transfers')

	const seen = new Set<string>()
	return blockscoutListPage(
		wire.items.map((tokenTransfer) => {
			const from = hexLowerOfByteSize(tokenTransfer.from.hash, 20) ?? ''
			const to = hexLowerOfByteSize(tokenTransfer.to.hash, 20) ?? ''
			if (from !== normalized && to !== normalized)
				throw new Error('Blockscout_Rest: address token transfer does not match the requested address')

			const transactionHash = blockscoutTransactionHash(tokenTransfer.transaction_hash, 'address token transfer')
			const identity = `${transactionHash}:${String(tokenTransfer.log_index)}`
			if (seen.has(identity))
				throw new Error('Blockscout_Rest: address token transfers contain duplicate identities')

			seen.add(identity)
			return tokenTransfer
		}),
		wire.next_page_params,
		requestedContinuation,
		'address token transfers'
	)
}

/**
 * All token balances for an address (ERC-20 / ERC-721 / ERC-1155 / ERC-404).
 * @see https://docs.blockscout.com/devs/apis/rest/addresses#get-token-balances
 */
export const getAddressTokenBalances = async ({ chainId, address }: {
	chainId: number
	address: `0x${string}`
}): Promise<BlockscoutAddressTokenBalances> => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address token balances: invalid address')

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/token-balances`,
	})
	if (response.status === 404)
		return []
	await throwIfHttpNotOk(response, response.url)
	const wire = await response.json<BlockscoutAddressTokenBalances>()
	assertBlockscoutEnvelope(blockscoutTokenBalancesEnvelope, wire, 'address token balances')

	const seen = new Set<string>()
	return wire.map((item) => {
		const balance = validatedBlockscoutTokenBalanceWire(item)
		const tokenAddress = balance.token?.address_hash ?? ''
		const tokenId = balance.token_id ?? ''
		const identity = `${tokenAddress}:${tokenId}`
		if (seen.has(identity))
			throw new Error('Blockscout_Rest: address token balances contain duplicate identities')

		seen.add(identity)
		return balance
	})
}

/**
 * Native coin balance change history for an address.
 * @see https://docs.blockscout.com/devs/apis/rest/addresses#get-coin-balance-history-by-address
 */
export const getAddressCoinBalanceHistory = async ({ chainId, address, limit }: {
	chainId: number
	address: `0x${string}`
	limit: number
}): Promise<BlockscoutCoinBalance[]> => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address coin balance history: invalid address')

	const wire = await getBlockscoutJson<BlockscoutCoinBalanceHistoryPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/coin-balance-history`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutEnvelope(blockscoutCoinBalanceHistoryPageEnvelope, wire, 'address coin balance history')

	const seen = new Set<number>()
	return wire.items.slice(0, limit).map((item) => {
		BigInt(item.value)
		if (item.delta !== '')
			BigInt(item.delta)
		if (!Number.isSafeInteger(item.block_number) || item.block_number < 0)
			throw new Error('Blockscout_Rest: invalid coin balance history block_number')
		const timestampMs = Date.parse(item.block_timestamp)
		if (!Number.isFinite(timestampMs) || timestampMs < 0)
			throw new Error('Blockscout_Rest: invalid coin balance history block_timestamp')
		if (seen.has(item.block_number))
			throw new Error('Blockscout_Rest: address coin balance history contains duplicate identities')

		seen.add(item.block_number)
		return item
	})
}

/**
 * Paginated token balances for an address with optional ERC type filter.
 * @see https://docs.blockscout.com/devs/apis/rest/addresses#get-tokens
 */
export const getAddressTokens = async ({
	chainId,
	address,
	limit,
	type,
}: {
	chainId: number
	address: `0x${string}`
	limit: number
	type?: string
}): Promise<BlockscoutTokenBalance[]> => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return []

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/tokens`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
			...(type != null && type.length > 0 && {
				type,
			}),
		},
	})
	if (response.status === 404)
		return []
	await throwIfHttpNotOk(response, response.url)
	const wire = await response.json<BlockscoutAddressTokensPage>()
	assertBlockscoutEnvelope(blockscoutAddressTokensPageEnvelope, wire, 'address tokens')

	const seen = new Set<string>()
	return wire.items.slice(0, limit).map((item) => {
		const balance = validatedBlockscoutTokenBalanceWire(item)
		const tokenAddress = balance.token?.address_hash ?? ''
		const tokenId = balance.token_id ?? ''
		const identity = `${tokenAddress}:${tokenId}`
		if (seen.has(identity))
			throw new Error('Blockscout_Rest: address tokens contain duplicate identities')

		seen.add(identity)
		return balance
	})
}

export const getTokenTransfers = async ({ chainId, limit }: {
	chainId: number
	limit: number
}) => {
	if (limit <= 0)
		return []

	const wire = await getBlockscoutJson<BlockscoutTokenTransfersPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/token-transfers',
		searchParams: {
			limit: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutEnvelope(blockscoutTokenTransfersPageEnvelope, wire, 'token transfers')

	const seen = new Set<string>()
	return wire.items.map((tokenTransfer) => {
		const transactionHash = blockscoutTransactionHash(tokenTransfer.transaction_hash, 'token transfer')
		const identity = `${transactionHash}:${String(tokenTransfer.log_index)}`
		if (seen.has(identity))
			throw new Error('Blockscout_Rest: token transfers contain duplicate identities')

		seen.add(identity)
		return tokenTransfer
	})
}

export const getTransactionTokenTransfers = async ({ chainId, txHash, limit }: {
	chainId: number
	txHash: string
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const wire = await getBlockscoutJson<BlockscoutTransactionTokenTransfersPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/transactions/${normalized}/token-transfers`,
	})
	assertBlockscoutEnvelope(blockscoutTokenTransfersPageEnvelope, wire, 'transaction token transfers')

	const seen = new Set<number>()
	return wire.items.slice(0, limit).map((tokenTransfer) => {
		const transactionHash = blockscoutTransactionHash(tokenTransfer.transaction_hash, 'transaction token transfer')
		if (transactionHash !== normalized)
			throw new Error('Blockscout_Rest: transaction token transfer does not match the requested transaction hash')
		if (seen.has(tokenTransfer.log_index))
			throw new Error('Blockscout_Rest: transaction token transfers contain duplicate identities')

		seen.add(tokenTransfer.log_index)
		return tokenTransfer
	})
}

export const getTransactionInternalTransactions = async ({ chainId, txHash, limit }: {
	chainId: number
	txHash: string
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const wire = await getBlockscoutJson<BlockscoutTransactionInternalTransactionsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/transactions/${normalized}/internal-transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'transaction internal transactions')

	const seen = new Set<number>()
	return wire.items.map((internalTransaction) => {
		const transactionHash = blockscoutTransactionHash(internalTransaction.transaction_hash, 'transaction internal transaction')
		if (transactionHash !== normalized)
			throw new Error('Blockscout_Rest: transaction internal transaction does not match the requested transaction hash')
		if (!Number.isSafeInteger(internalTransaction.index) || internalTransaction.index < 0)
			throw new Error('Blockscout_Rest: invalid transaction internal transaction index')
		if (seen.has(internalTransaction.index))
			throw new Error('Blockscout_Rest: transaction internal transactions contain duplicate identities')

		seen.add(internalTransaction.index)
		return internalTransaction
	}).slice(0, limit)
}

export const getAddressInternalTransactions = async ({
	chainId,
	address,
	limit,
	continuation,
}: {
	chainId: number
	address: `0x${string}`
	limit: number
	continuation?: string
}) => {
	if (limit <= 0)
		return blockscoutListPage([], undefined, undefined, 'address internal transactions')

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return blockscoutListPage([], undefined, undefined, 'address internal transactions')

	const {
		requestedContinuation,
		searchParams,
	} = blockscoutListRequest({
		limit,
		continuation,
		label: 'address internal transactions',
	})
	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/internal-transactions`,
		searchParams,
	})
	if (response.status === 404)
		return blockscoutListPage([], undefined, requestedContinuation, 'address internal transactions')
	await throwIfHttpNotOk(response, response.url)

	const wire = await response.json<BlockscoutAddressInternalTransactionsPage>()
	assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'address internal transactions')

	const seen = new Set<string>()
	return blockscoutListPage(
		wire.items.map((internalTransaction) => {
			const from = hexLowerOfByteSize(internalTransaction.from.hash, 20) ?? ''
			const to = internalTransaction.to != null ? (hexLowerOfByteSize(internalTransaction.to.hash, 20) ?? '') : ''
			const createdContract = internalTransaction.created_contract != null ? (hexLowerOfByteSize(internalTransaction.created_contract.hash, 20) ?? '') : ''
			if (from !== normalized && to !== normalized && createdContract !== normalized)
				throw new Error('Blockscout_Rest: address internal transaction does not match the requested address')

			const transactionHash = blockscoutTransactionHash(internalTransaction.transaction_hash, 'address internal transaction')
			const identity = `${transactionHash}:${String(internalTransaction.index)}`
			if (seen.has(identity))
				throw new Error('Blockscout_Rest: address internal transactions contain duplicate identities')

			seen.add(identity)
			return internalTransaction
		}),
		wire.next_page_params,
		requestedContinuation,
		'address internal transactions'
	)
}

export const getTransactionLogs = async ({ chainId, txHash }: {
	chainId: number
	txHash: string
}) => {
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const logs: BlockscoutTransactionLogsPage['items'] = []
	const seenLogIndices = new Set<number>()
	let maxLogIndex = -1
	let nextPageParams: NonNullable<BlockscoutTransactionLogsPage['next_page_params']> | undefined
	do {
		const wire = await getBlockscoutJson<BlockscoutTransactionLogsPage>({
			binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
			path: `/transactions/${normalized}/logs`,
			searchParams: nextPageParams,
		})
		assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'transaction logs')
		for (const log of wire.items) {
			const transactionHash = blockscoutTransactionHash(log.transaction_hash, 'transaction log')
			if (transactionHash !== normalized)
				throw new Error('Blockscout_Rest: transaction log does not match the requested transaction hash')
			if (!Number.isSafeInteger(log.index) || log.index < 0)
				throw new Error('Blockscout_Rest: invalid transaction log index')
			if (seenLogIndices.has(log.index))
				throw new Error('Blockscout_Rest: transaction logs contain duplicate identities')

			seenLogIndices.add(log.index)
			if (log.index > maxLogIndex)
				maxLogIndex = log.index
			logs.push(log)
		}
		if (wire.next_page_params?.index != null && wire.next_page_params.index <= maxLogIndex)
			throw new Error('Blockscout_Rest: transaction logs pagination cursor did not progress')

		nextPageParams = wire.next_page_params ?? undefined
	} while (nextPageParams != null)

	return logs
}

export const getTransactionStateChanges = async ({ chainId, txHash, limit }: {
	chainId: number
	txHash: string
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const stateChanges: BlockscoutStateChange[] = []
	const stateChangeKeys = new Set<string>()
	const cursors = new Set<string>()
	let nextPageParams: NonNullable<BlockscoutTransactionStateChangesPage['next_page_params']> | undefined
	do {
		const wire = await getBlockscoutJson<BlockscoutTransactionStateChangesPage>({
			binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
			path: `/transactions/${normalized}/state-changes`,
			searchParams: nextPageParams,
		})
		assertBlockscoutEnvelope(blockscoutTransactionStateChangesPageEnvelope, wire, 'transaction state changes')
		for (const stateChange of wire.items) {
			const stateChangeKey = blockscoutStateChangeKey(stateChange)
			if (stateChangeKeys.has(stateChangeKey))
				throw new Error('Blockscout_Rest: transaction state changes contain duplicate identities')

			stateChangeKeys.add(stateChangeKey)
			stateChanges.push(stateChange)
			if (stateChanges.length >= limit)
				return stateChanges
		}

		if (wire.next_page_params == null) {
			nextPageParams = undefined
			continue
		}

		const {
			state_changes: cursor,
			items_count: itemsCount,
		} = wire.next_page_params
		if (
			cursor == null
			|| cursor.length === 0
			|| itemsCount == null
			|| !Number.isSafeInteger(itemsCount)
			|| itemsCount < stateChanges.length
			|| cursors.has(cursor)
		) throw new Error('Blockscout_Rest: transaction state changes pagination cursor did not progress')

		cursors.add(cursor)
		nextPageParams = {
			state_changes: cursor,
			items_count: itemsCount,
		}
	} while (nextPageParams != null)

	return stateChanges
}

export const normalizeAddressFromContractListWire = (wire: BlockscoutSmartContractForList) => {
	const address = wire.address.hash
	if (address === '')
		return null

	const normalized = address.startsWith('0x') ? address : `0x${address}`
	return hexLowerOfByteSize(normalized, 20) ?? null
}

export const getSmartContracts = async ({ chainId, limit }: {
	chainId: number
	limit: number
}) => {
	if (limit <= 0)
		return []

	const wire = await getBlockscoutJson<BlockscoutSmartContractsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/smart-contracts/',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'smart contracts')

	const seen = new Set<`0x${string}`>()
	return wire.items.map((smartContract) => {
		const address = blockscoutAddressHash(smartContract.address.hash, 'smart contract')
		if (seen.has(address))
			throw new Error('Blockscout_Rest: smart contracts contain duplicate identities')

		seen.add(address)
		return smartContract
	})
}

export const getSmartContract = async ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout smart contract: invalid address')

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/smart-contracts/${normalized}`,
	})
	if (response.status === 404)
		return null

	await throwIfHttpNotOk(response, response.url)
	return response.json<BlockscoutSmartContract>()
}

export const getCode = async ({ chainId, address }: {
	chainId: number
	address: `0x${string}`
}) => {
	const {
		evmExecutionJsonRpc,
	} = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return null

	return evmExecutionJsonRpc({
		binding: requireBlockscoutBinding(chainId, ApiFamily.EvmExecutionJsonRpc),
	}).getCode({ address: normalized })
}

export const getStorageAt = async ({
	chainId,
	address,
	slotQuantityHex,
	blockTag = 'latest',
}: {
	chainId: number
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => {
	const {
		evmExecutionJsonRpc,
	} = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return null

	return evmExecutionJsonRpc({
		binding: requireBlockscoutBinding(chainId, ApiFamily.EvmExecutionJsonRpc),
	}).getStorageAt({
		address: normalized,
		slotQuantityHex,
		blockTag,
	})
}

const blockscoutErc4337PathHash = (value: string, byteSize: 20 | 32, label: string) => {
	const normalized = hexLowerOfByteSize(value, byteSize)
	if (normalized == null)
		throw new Error(`${label}: invalid hash`)

	return normalized
}

export const getUserOperationsPage = async ({
	chainId,
	limit,
	transactionHash,
	sender,
	bundler,
	paymaster,
	factory,
	continuation,
}: {
	chainId: number
	limit: number
	transactionHash?: string
	sender?: string
	bundler?: string
	paymaster?: string
	factory?: string
	continuation?: string
}) => {
	const request = blockscoutErc4337ListRequest({
		limit,
		continuation,
		label: 'user operations',
	})
	if (limit <= 0)
		return blockscoutListPage([], undefined, request.requestedContinuation, 'user operations')

	const requestedTransactionHash = transactionHash != null ? blockscoutErc4337PathHash(
		transactionHash,
		32,
		'Blockscout user operations by transaction'
	) : undefined
	const requestedSender = sender != null ? blockscoutAddressHash(sender, 'Blockscout user operations by sender') : undefined

	const wire = await getBlockscoutJson<BlockscoutUserOperationsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/proxy/account-abstraction/operations',
		searchParams: {
			...request.searchParams,
			...(transactionHash != null && { transaction_hash: requestedTransactionHash }),
			...(sender != null && { sender: requestedSender }),
			...(bundler != null && { bundler: blockscoutErc4337PathHash(bundler, 20, 'Blockscout user operations by bundler') }),
			...(paymaster != null && { paymaster: blockscoutErc4337PathHash(paymaster, 20, 'Blockscout user operations by paymaster') }),
			...(factory != null && { factory: blockscoutErc4337PathHash(factory, 20, 'Blockscout user operations by factory') }),
		},
	})
	assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'user operations')

	const seen = new Set<`0x${string}`>()
	return blockscoutListPage(wire.items.slice(0, limit).map((item) => {
		const hash = blockscoutTransactionHash(item.hash, 'user operation')
		if (seen.has(hash))
			throw new Error('Blockscout_Rest: user operations contain duplicate identities')

		seen.add(hash)
		if (requestedTransactionHash != null) {
			const itemTransactionHash = blockscoutTransactionHash(item.transaction_hash, 'user operation transaction')
			if (itemTransactionHash !== requestedTransactionHash)
				throw new Error('Blockscout_Rest: user operation does not match the requested transaction hash')
		}
		if (requestedSender != null) {
			const itemSender = blockscoutAddressHash(item.address.hash, 'user operation sender')
			if (itemSender !== requestedSender)
				throw new Error('Blockscout_Rest: user operation does not match the requested sender')
		}
		return item
	}), wire.next_page_params, request.requestedContinuation, 'user operations')
}

export const getUserOperationDetail = ({
	chainId,
	hash,
}: {
	chainId: number
	hash: string
}) => getBlockscoutJson<BlockscoutUserOperationDetail>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `/proxy/account-abstraction/operations/${blockscoutErc4337PathHash(
		hash,
		32,
		'Blockscout user operation detail'
	)}`,
})

const erc4337RegistryPath = {
	smartAccount: '/proxy/account-abstraction/accounts',
	bundler: '/proxy/account-abstraction/bundlers',
	paymaster: '/proxy/account-abstraction/paymasters',
	accountFactory: '/proxy/account-abstraction/factories',
} as const

/**
 * Live Blockscout hosts currently time out top bundler/paymaster/factory list routes
 * (`HTTP 500 {"error":"timeout"}`). Those Network facets are omitted from Blockscout-Rest
 * until a working host or alternate source exists — do not soft-return `[]` for that failure.
 */
export const getErc4337SmartAccountList = async ({
	chainId,
	limit,
	factory,
	continuation,
}: {
	chainId: number
	limit: number
	factory?: string
	continuation?: string
}) => {
	const request = blockscoutErc4337ListRequest({
		limit,
		continuation,
		label: 'ERC-4337 accounts',
	})
	if (limit <= 0)
		return blockscoutListPage([], undefined, request.requestedContinuation, 'ERC-4337 accounts')

	const wire = await getBlockscoutJson<BlockscoutErc4337AccountsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: erc4337RegistryPath.smartAccount,
		searchParams: {
			...request.searchParams,
			...(factory != null && {
				factory: blockscoutErc4337PathHash(factory, 20, 'Blockscout ERC-4337 accounts by factory'),
			}),
		},
	})
	assertBlockscoutEnvelope(blockscoutPageEnvelope, wire, 'ERC-4337 accounts')

	const seen = new Set<`0x${string}`>()
	return blockscoutListPage(wire.items.slice(0, limit).map((item) => {
		const address = blockscoutAddressHash(item.address.hash, 'ERC-4337 account')
		if (seen.has(address))
			throw new Error('Blockscout_Rest: ERC-4337 accounts contain duplicate identities')

		seen.add(address)
		return item
	}), wire.next_page_params, request.requestedContinuation, 'ERC-4337 accounts')
}

export const getErc4337SmartAccountDetail = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => getBlockscoutJson<BlockscoutErc4337Account>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `${erc4337RegistryPath.smartAccount}/${
		blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 account')
	}`,
})

export const getErc4337BundlerDetail = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => getBlockscoutJson<BlockscoutErc4337Bundler>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `${erc4337RegistryPath.bundler}/${
		blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 bundler')
	}`,
})

export const getErc4337PaymasterDetail = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => getBlockscoutJson<BlockscoutErc4337Paymaster>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `${erc4337RegistryPath.paymaster}/${
		blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 paymaster')
	}`,
})

export const getErc4337AccountFactoryDetail = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => getBlockscoutJson<BlockscoutErc4337AccountFactory>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `${erc4337RegistryPath.accountFactory}/${
		blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 factory')
	}`,
})
