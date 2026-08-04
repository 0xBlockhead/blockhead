/**
 * Etherscan API V2 query helpers — **`module=proxy`** (Geth-compatible) and **`module=contract`**.
 *
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionbyhash
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionreceipt
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgetblockbynumber
 * @see https://docs.etherscan.io/api-reference/endpoint/ethblocknumber
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */

import type {
	EtherscanAccountArray,
	EtherscanErc1155TokenTransfer,
	EtherscanErc20TokenTransfer,
	EtherscanErc721TokenTransfer,
	EtherscanGasOracle,
	EtherscanInternalTransaction,
	EtherscanNormalTransaction,
	EtherscanStringStatus,
	EtherscanTokenTransferTagged,
} from '$/sources/Etherscan/Rest/types.ts'
import type {
	RpcBlockHeader,
	RpcReceipt,
	RpcTransaction,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	etherscanV2GetJson,
	etherscanV2GetProxyResult,
	etherscanV2UnwrapAccountResultArray,
} from '$/sources/Etherscan/Rest/client.ts'
import { supportedChainIds } from '$/sources/Etherscan/Rest/constants.ts'

export const supportsChainId = (chainId: number) => (
	supportedChainIds.some((supportedChainId) => supportedChainId === chainId)
)

/** Etherscan account list endpoints cap at 10_000 rows per request. */
export const getAccountListMaxOffset = 10_000

const etherscanAccountListQuery = ({
	address,
	offset,
}: {
	address: `0x${string}`
	offset: number
}) => ({
	module: 'account',
	address,
	startblock: '0',
	endblock: '99999999',
	page: '1',
	offset: String(Math.min(Math.max(1, offset), getAccountListMaxOffset)),
	sort: 'asc',
})

const etherscanAccountListRows = async <T>({
	publicEnv,
	chainId,
	query,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	query: Record<string, string | undefined>
}) => (
	etherscanV2UnwrapAccountResultArray(
		await etherscanV2GetJson<EtherscanAccountArray<T>>({
			chainId,
			publicEnv,
			query,
		})
	)
)

/**
 * **`module=proxy`**, **`action=eth_getTransactionByHash`**, **`txhash`**.
 *
 * ```bash
 * curl "https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getTransactionByHash&txhash=…&apikey=YourApiKeyToken"
 * ```
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionbyhash
 */
export const getTransactionByHash = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return null

	return etherscanV2GetProxyResult<RpcTransaction>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getTransactionByHash',
			txhash: normalizedTxHash,
		},
	})
}

/**
 * **`module=proxy`**, **`action=eth_getTransactionReceipt`**, **`txhash`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionreceipt
 */
export const getTransactionReceipt = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return null

	return etherscanV2GetProxyResult<RpcReceipt>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getTransactionReceipt',
			txhash: normalizedTxHash,
		},
	})
}

/**
 * **`module=proxy`**, **`action=eth_blockNumber`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethblocknumber
 */
export const getBlockNumber = async ({
	publicEnv,
	chainId,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
}) => {
	const blockNumberHex = await etherscanV2GetProxyResult<string>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_blockNumber',
		},
	})
	return typeof blockNumberHex === 'string' ? blockNumberHex : null
}

/**
 * **`module=proxy`**, **`action=eth_getBlockByNumber`**, **`tag`** (hex block number or **`latest`**), **`boolean`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgetblockbynumber
 */
export const getBlockByNumber = async ({
	publicEnv,
	chainId,
	blockNumber,
	tag = (
		blockNumber == null ?
			'latest'
		:
			`0x${blockNumber.toString(16)}`
	),
	includeTransactions = false,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	blockNumber?: bigint
	tag?: string
	includeTransactions?: boolean
}) => (
	etherscanV2GetProxyResult<RpcBlockHeader>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getBlockByNumber',
			tag,
			boolean: includeTransactions ? 'true' : 'false',
		},
	})
)

/**
 * **`module=contract`**, **`action=getabi`**, **`address`**.
 * Returns parsed ABI JSON string from **`result`**, or **`null`** if unverified / error.
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */
export const getContractAbiJsonString = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => {
	const wire = await etherscanV2GetJson<EtherscanStringStatus>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getabi',
			address,
		},
	})
	if (wire.status === '1' && typeof wire.result === 'string' && wire.result.trim())
		return wire.result

	const sourceRow = await getContractSourceCode({
		publicEnv,
		chainId,
		address,
	})
	const abi = sourceRow?.ABI
	return typeof abi === 'string' && abi.trim() ? abi : null
}

/**
 * **`module=contract`**, **`action=getsourcecode`**, **`address`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/getsourcecode
 */
export const getContractSourceCode = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => {
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractSourceCode>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getsourcecode',
			address,
		},
	})
	if (wire.status !== '1' || !Array.isArray(wire.result)) return null
	return wire.result[0] ?? null
}

/**
 * **`module=contract`**, **`action=getcontractcreation`**, **`contractaddresses`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/getcontractcreation
 */
export const getContractCreation = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => {
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractCreation>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getcontractcreation',
			contractaddresses: address,
		},
	})
	if (wire.status !== '1' || !Array.isArray(wire.result)) return null
	return (
		wire.result.find((row) => (
			row.contractAddress?.toLowerCase() === address.toLowerCase()
		))
		?? wire.result[0]

	)
}

/** **`module=proxy`**, **`action=eth_getCode`**. */
export const getCode = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => (
	etherscanV2GetProxyResult<`0x${string}`>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getCode',
			address,
			tag: 'latest',
		},
	})
)

/** **`module=proxy`**, **`action=eth_getStorageAt`**. */
export const getStorageAt = async ({
	publicEnv,
	chainId,
	address,
	slotQuantityHex,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
}) => (
	etherscanV2GetProxyResult<`0x${string}`>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getStorageAt',
			address,
			position: slotQuantityHex,
			tag: 'latest',
		},
	})
)

/**
 * **`module=gastracker`**, **`action=gasoracle`** — slow / average / fast tiers in gwei.
 * @see https://docs.etherscan.io/api-reference/endpoint/gasoracle
 */
export const getGasOracle = async ({
	publicEnv,
	chainId,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
}) => {
	const wire = await etherscanV2GetJson<EtherscanGasOracle>({
		chainId,
		publicEnv,
		query: {
			module: 'gastracker',
			action: 'gasoracle',
		},
	})
	if (wire.status !== '1') return null
	return wire.result
}

type EtherscanTokenTransferByAction = {
	token1155tx: EtherscanErc1155TokenTransfer
	tokennfttx: EtherscanErc721TokenTransfer
	tokentx: EtherscanErc20TokenTransfer
}

/**
 * **`module=account`**, **`action=tokentx|tokennfttx|token1155tx`** — token transfers by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/tokentx
 */
const getTokenTransfersByAddressAction = <_Action extends keyof EtherscanTokenTransferByAction>({
	publicEnv,
	chainId,
	address,
	offset,
	action,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
	offset: number
	action: _Action
}) => (
	etherscanAccountListRows<EtherscanTokenTransferByAction[_Action]>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action,
		},
	})
)

/**
 * ERC-20 / ERC-721 / ERC-1155 token transfers for an address (merged, deduped).
 */
export const getTokenTransfersByAddress = async ({
	publicEnv,
	chainId,
	address,
	offset,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
	offset: number
}) => {
	const [
		erc20Rows,
		erc721Rows,
		erc1155Rows,
	] = await Promise.all([
		getTokenTransfersByAddressAction({
			publicEnv,
			chainId,
			address,
			offset,
			action: 'tokentx',
		}),
		getTokenTransfersByAddressAction({
			publicEnv,
			chainId,
			address,
			offset,
			action: 'tokennfttx',
		}),
		getTokenTransfersByAddressAction({
			publicEnv,
			chainId,
			address,
			offset,
			action: 'token1155tx',
		}),
	])
	if (erc20Rows == null || erc721Rows == null || erc1155Rows == null) return null
	const seen = new Set<string>()
	return [
		...erc20Rows.map<EtherscanTokenTransferTagged>((row) => ({
			standard: 'erc20',
			row,
		})),
		...erc721Rows.map<EtherscanTokenTransferTagged>((row) => ({
			standard: 'erc721',
			row,
		})),
		...erc1155Rows.map<EtherscanTokenTransferTagged>((row) => ({
			standard: 'erc1155',
			row,
		})),
	].filter(({ standard, row }) => {
		const key = [
			row.hash?.toLowerCase() ?? '',
			row.logIndex ?? '',
			row.transactionIndex ?? '',
			row.from?.toLowerCase() ?? '',
			row.to?.toLowerCase() ?? '',
			row.contractAddress?.toLowerCase() ?? '',
			standard === 'erc20' ?
				row.value ?? ''
			: standard === 'erc721' ?
				row.tokenID ?? ''
			:
				`${row.tokenID ?? ''}:${row.tokenValue ?? ''}`,
		].join(':')
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}

/**
 * Token transfers within one transaction — Etherscan has no `tokentx` by tx hash; loads
 * **`from`** / **`to`** participant address lists and filters by **`hash`**.
 */
export const getTokenTransfersByTransaction = async ({
	publicEnv,
	chainId,
	txHash,
	offset,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
	offset: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return null

	const tx = await getTransactionByHash({
		publicEnv,
		chainId,
		txHash: normalizedTxHash,
	})
	if (tx == null) return null
	const participantAddresses = [
		...new Set(
			[
				tx.from,
				tx.to,
			]
				.filter((address): address is `0x${string}` => (
					address != null && address !== ''
				))
		),
	]
	if (participantAddresses.length === 0) return []
	const participantRows = await Promise.all(
		participantAddresses.map((address) => (
			getTokenTransfersByAddress({
				publicEnv,
				chainId,
				address,
				offset,
			})
		))
	)
	if (participantRows.some((rows) => rows == null)) return null
	const seen = new Set<string>()
	return participantRows.flatMap((rows) => rows ?? []).filter(({ standard, row }) => {
		if (row.hash?.toLowerCase() !== normalizedTxHash) return false
		const key = [
			row.logIndex ?? '',
			row.transactionIndex ?? '',
			row.from?.toLowerCase() ?? '',
			row.to?.toLowerCase() ?? '',
			row.contractAddress?.toLowerCase() ?? '',
			standard === 'erc20' ?
				row.value ?? ''
			: standard === 'erc721' ?
				row.tokenID ?? ''
			:
				`${row.tokenID ?? ''}:${row.tokenValue ?? ''}`,
		].join(':')
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}

/**
 * **`module=account`**, **`action=txlist`** — normal transactions by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlist
 */
export const getTransactionsByAddress = ({
	publicEnv,
	chainId,
	address,
	offset,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
	offset: number
}) => (
	etherscanAccountListRows<EtherscanNormalTransaction>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action: 'txlist',
		},
	})
)

/**
 * **`module=account`**, **`action=txlistinternal`** — internal transactions by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlistinternal
 */
export const getInternalTransactionsByAddress = ({
	publicEnv,
	chainId,
	address,
	offset,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
	offset: number
}) => (
	etherscanAccountListRows<EtherscanInternalTransaction>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action: 'txlistinternal',
		},
	})
)

/**
 * **`module=account`**, **`action=txlistinternal`**, **`txhash`** — internal transactions in one tx.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlistinternal-txhash
 */
export const getInternalTransactionsByTxHash = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return null

	return etherscanAccountListRows<EtherscanInternalTransaction>({
		publicEnv,
		chainId,
		query: {
			module: 'account',
			action: 'txlistinternal',
			txhash: normalizedTxHash,
		},
	})
}
