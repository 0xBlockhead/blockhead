/**
 * Blockscout REST v2 reads and the Blockscout-hosted execution RPC facade.
 * @see https://docs.blockscout.com/devs/apis/rest
 * @see https://docs.blockscout.com/devs/apis/rpc/eth-rpc
 */
import { throwIfHttpNotOk } from '$/lib/http.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Blockscout/bindings.ts'
import {
	getBlockscoutJson,
	getBlockscoutResponse,
} from '$/sources/Blockscout/Rest/client.ts'
import { blockscoutV2ItemsCountMax } from '$/sources/Blockscout/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceOperationGroup,
} from '$/sources/SourceBinding.ts'
import type {
	BlockscoutAddressCounters,
	BlockscoutAddressDetails,
	BlockscoutAddressInternalTransactionsPage,
	BlockscoutAddressTokenTransfersPage,
	BlockscoutAddressTransactionsPage,
	BlockscoutBlockDetails,
	BlockscoutBlocksPage,
	BlockscoutBlockTransactionsPage,
	BlockscoutErc4337Account,
	BlockscoutErc4337AccountsPage,
	BlockscoutErc4337AccountFactory,
	BlockscoutErc4337Bundler,
	BlockscoutErc4337BundlersPage,
	BlockscoutErc4337FactoriesPage,
	BlockscoutErc4337Paymaster,
	BlockscoutErc4337PaymastersPage,
	BlockscoutSmartContract,
	BlockscoutSmartContractForList,
	BlockscoutSmartContractsPage,
	BlockscoutStats,
	BlockscoutTokenTransfersPage,
	BlockscoutTransaction,
	BlockscoutTransactionInternalTransactionsPage,
	BlockscoutTransactionLogsPage,
	BlockscoutTransactionsPage,
	BlockscoutTransactionTokenTransfersPage,
	BlockscoutUserOperationDetail,
	BlockscoutUserOperationsPage,
} from '$/sources/Blockscout/Rest/types.ts'

type BlockscoutErc4337RegistryPage =
	| BlockscoutErc4337AccountsPage
	| BlockscoutErc4337BundlersPage
	| BlockscoutErc4337PaymastersPage
	| BlockscoutErc4337FactoriesPage

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
	for (const quantity of [
		wire.gas_limit,
		wire.gas_price,
		wire.max_fee_per_gas,
		wire.max_priority_fee_per_gas,
	])
		if (quantity != null && quantity !== '')
			BigInt(quantity)

	return wire
}
const blockscoutItemsCount = (limit: number) => Math.min(
	Math.max(Number.isFinite(limit) ? limit : 0, 0),
	blockscoutV2ItemsCountMax
)

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

export const getBlockByNumber = ({ chainId, blockNumber }: {
	chainId: number
	blockNumber: bigint
}) => getBlockscoutJson<BlockscoutBlockDetails>({
	binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
	path: `/blocks/${blockNumber}`,
})

export const getBlocks = async ({ chainId, limit }: {
	chainId: number
	limit: number
}) => {
	if (limit <= 0)
		return []

	const wire = await getBlockscoutJson<BlockscoutBlocksPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/blocks',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})

	return wire.items
}

export const getBlockTransactions = async ({ chainId, blockNumber, limit }: {
	chainId: number
	blockNumber: bigint
	limit: number
}) => {
	if (limit <= 0)
		return []

	const wire = await getBlockscoutJson<BlockscoutBlockTransactionsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/blocks/${blockNumber}/transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})

	return wire.items.map(validatedBlockscoutTransactionWire)
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

	return validatedBlockscoutTransactionWire(wire)
}

export const getTransactions = async ({ chainId, limit }: {
	chainId: number
	limit: number
}) => {
	if (limit <= 0)
		return []

	const wire = await getBlockscoutJson<BlockscoutTransactionsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/transactions',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})

	return wire.items.map(validatedBlockscoutTransactionWire)
}

export const getAddressTransactions = async ({ chainId, address, limit }: {
	chainId: number
	address: `0x${string}`
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return []

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	if (response.status === 404)
		return []
	await throwIfHttpNotOk(response, response.url)

	return (
		(await response.json<BlockscoutAddressTransactionsPage>())
			.items.map(validatedBlockscoutTransactionWire)
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

export const getAddressTokenTransfers = async ({ chainId, address, limit }: {
	chainId: number
	address: `0x${string}`
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return []

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/token-transfers`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	if (response.status === 404)
		return []
	await throwIfHttpNotOk(response, response.url)

	return (await response.json<BlockscoutAddressTokenTransfersPage>()).items
}

export const getTokenTransfers = async ({ chainId, limit }: {
	chainId: number
	limit: number
}) => {
	if (limit <= 0)
		return []

	return (await getBlockscoutJson<BlockscoutTokenTransfersPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/token-transfers',
		searchParams: {
			limit: blockscoutItemsCount(limit),
		},
	})).items
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

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/transactions/${normalized}/token-transfers`,
	})
	if (response.status === 422)
		return []
	await throwIfHttpNotOk(response, response.url)

	return (
		(await response.json<BlockscoutTransactionTokenTransfersPage>())
			.items.slice(0, limit)
	)
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

	return wire.items
}

export const getAddressInternalTransactions = async ({ chainId, address, limit }: {
	chainId: number
	address: `0x${string}`
	limit: number
}) => {
	if (limit <= 0)
		return []

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return []

	const response = await getBlockscoutResponse({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/addresses/${normalized}/internal-transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	if (response.status === 404)
		return []
	await throwIfHttpNotOk(response, response.url)

	return (await response.json<BlockscoutAddressInternalTransactionsPage>()).items
}

export const getTransactionLogs = async ({ chainId, txHash }: {
	chainId: number
	txHash: string
}) => {
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null)
		return []

	const logs: BlockscoutTransactionLogsPage['items'] = []
	let nextPageParams: NonNullable<BlockscoutTransactionLogsPage['next_page_params']> | undefined
	do {
		const wire = await getBlockscoutJson<BlockscoutTransactionLogsPage>({
			binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
			path: `/transactions/${normalized}/logs`,
			searchParams: nextPageParams,
		})
		logs.push(...wire.items)
		nextPageParams = wire.next_page_params ?? undefined
	} while (nextPageParams != null)

	return logs
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

	return wire.items
}

export const getSmartContract = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout smart contract: invalid address')

	return getBlockscoutJson<BlockscoutSmartContract>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: `/smart-contracts/${normalized}`,
	})
}

export const getCode = async ({ chainId, address }: {
	chainId: number
	address: `0x${string}`
}) => {
	const {
		getCode: getCodeFromExecutionRpc,
	} = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return null

	return getCodeFromExecutionRpc({
		binding: requireBlockscoutBinding(chainId, ApiFamily.EvmExecutionJsonRpc),
		address: normalized,
	})
}

export const getStorageAt = async ({ chainId, address, slotQuantityHex }: {
	chainId: number
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
}) => {
	const {
		getStorageAt: getStorageAtFromExecutionRpc,
	} = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return null

	return getStorageAtFromExecutionRpc({
		binding: requireBlockscoutBinding(chainId, ApiFamily.EvmExecutionJsonRpc),
		address: normalized,
		slotQuantityHex,
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
}: {
	chainId: number
	limit: number
	transactionHash?: string
}) => {
	if (limit <= 0)
		return []

	return (await getBlockscoutJson<BlockscoutUserOperationsPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path: '/proxy/account-abstraction/operations',
		searchParams: {
			page_size: blockscoutItemsCount(limit),
			...(transactionHash != null && {
				transaction_hash: blockscoutErc4337PathHash(
					transactionHash,
					32,
					'Blockscout user operations by transaction'
				),
			}),
		},
	})).items
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
const getErc4337RegistryList = async ({
	chainId,
	limit,
	path,
}: {
	chainId: number
	limit: number
	path: (typeof erc4337RegistryPath)[keyof typeof erc4337RegistryPath]
}) => {
	if (limit <= 0)
		return []

	return (await getBlockscoutJson<BlockscoutErc4337RegistryPage>({
		binding: requireBlockscoutBinding(chainId, ApiFamily.BlockscoutRestV2),
		path,
		searchParams: {
			page_size: blockscoutItemsCount(limit),
		},
	})).items
}

export const getErc4337SmartAccountList = ({
	chainId,
	limit,
}: {
	chainId: number
	limit: number
}) => getErc4337RegistryList({
	chainId,
	limit,
	path: erc4337RegistryPath.smartAccount,
})

export const getErc4337BundlerList = ({
	chainId,
	limit,
}: {
	chainId: number
	limit: number
}) => getErc4337RegistryList({
	chainId,
	limit,
	path: erc4337RegistryPath.bundler,
})

export const getErc4337PaymasterList = ({
	chainId,
	limit,
}: {
	chainId: number
	limit: number
}) => getErc4337RegistryList({
	chainId,
	limit,
	path: erc4337RegistryPath.paymaster,
})

export const getErc4337AccountFactoryList = ({
	chainId,
	limit,
}: {
	chainId: number
	limit: number
}) => getErc4337RegistryList({
	chainId,
	limit,
	path: erc4337RegistryPath.accountFactory,
})

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
