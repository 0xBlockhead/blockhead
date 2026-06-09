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
	EtherscanProxyJsonRpc,
	EtherscanStringStatus,
} from '$/sources/Etherscan/Rest/types.ts'
import type {
	RpcBlockHeader,
	RpcReceipt,
	RpcTransaction,
} from '$/sources/Evm/JsonRpc/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	etherscanV2GetJson,
	etherscanV2UnwrapAccountResultArray,
	etherscanV2UnwrapProxyResult,
} from '$/sources/Etherscan/Rest/client.ts'

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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	query: Record<string, string | undefined>
	options?: { apiKey?: string }
}): Promise<T[] | null> => (
	etherscanV2UnwrapAccountResultArray(
		await etherscanV2GetJson<EtherscanAccountArray<T>>({
			chainId,
			publicEnv,
			query,
			options,
		}),
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	options?: { apiKey?: string }
}): Promise<RpcTransaction | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<RpcTransaction>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getTransactionByHash',
				txhash: txHash,
			},
			options,
		}),
	)
)

/**
 * **`module=proxy`**, **`action=eth_getTransactionReceipt`**, **`txhash`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionreceipt
 */
export const getTransactionReceipt = async ({
	publicEnv,
	chainId,
	txHash,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	options?: { apiKey?: string }
}): Promise<RpcReceipt | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<RpcReceipt>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getTransactionReceipt',
				txhash: txHash,
			},
			options,
		}),
	)
)

/**
 * **`module=proxy`**, **`action=eth_blockNumber`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethblocknumber
 */
export const getBlockNumber = async ({
	publicEnv,
	chainId,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	options?: { apiKey?: string }
}): Promise<string | null> => {
	const blockNumberHex = etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<string>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_blockNumber',
			},
			options,
		}),
	)
	return typeof blockNumberHex === 'string' ? blockNumberHex : null
}

/**
 * **`module=proxy`**, **`action=eth_getBlockByNumber`**, **`tag`** (hex block number or **`latest`**), **`boolean`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgetblockbynumber
 */
export const getBlockByNumber = async ({
	publicEnv,
	chainId,
	tag,
	boolean,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	tag: string
	boolean: boolean
	options?: { apiKey?: string }
}): Promise<RpcBlockHeader | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<RpcBlockHeader>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getBlockByNumber',
				tag,
				boolean: boolean ? 'true' : 'false',
			},
			options,
		}),
	)
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	options?: { apiKey?: string }
}): Promise<string | null> => {
	const wire = await etherscanV2GetJson<EtherscanStringStatus>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getabi',
			address,
		},
		options,
	})
	if (wire?.status === '1' && typeof wire.result === 'string' && wire.result.trim()) {
		return wire.result
	}
	const sourceRow = await getContractSourceCode({
		publicEnv,
		chainId,
		address,
		options,
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	options?: { apiKey?: string }
}) => {
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractSourceCode>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getsourcecode',
			address,
		},
		options,
	})
	if (wire == null || wire.status !== '1' || !Array.isArray(wire.result)) return null
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	options?: { apiKey?: string }
}) => {
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractCreation>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getcontractcreation',
			contractaddresses: address,
		},
		options,
	})
	if (wire == null || wire.status !== '1' || !Array.isArray(wire.result)) return null
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	options?: { apiKey?: string }
}): Promise<`0x${string}` | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<`0x${string}`>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getCode',
				address,
				tag: 'latest',
			},
			options,
		}),
	)
)

/** **`module=proxy`**, **`action=eth_getStorageAt`**. */
export const getStorageAt = async ({
	publicEnv,
	chainId,
	address,
	slotQuantityHex,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	options?: { apiKey?: string }
}): Promise<`0x${string}` | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpc<`0x${string}`>>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getStorageAt',
				address,
				position: slotQuantityHex,
				tag: 'latest',
			},
			options,
		}),
	)
)

/**
 * **`module=gastracker`**, **`action=gasoracle`** — slow / average / fast tiers in gwei.
 * @see https://docs.etherscan.io/api-reference/endpoint/gasoracle
 */
export const getGasOracle = async ({
	publicEnv,
	chainId,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	options?: { apiKey?: string }
}) => {
	const wire = await etherscanV2GetJson<EtherscanGasOracle>({
		chainId,
		publicEnv,
		query: {
			module: 'gastracker',
			action: 'gasoracle',
		},
		options,
	})
	if (wire == null || wire.status !== '1') return null
	return wire.result
}

/**
 * **`module=account`**, **`action=tokentx`** — ERC-20 token transfers by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/tokentx
 */
export const getErc20TokenTransfersByAddress = async ({
	publicEnv,
	chainId,
	address,
	offset,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<EtherscanErc20TokenTransfer[] | null> => (
	etherscanAccountListRows<EtherscanErc20TokenTransfer>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action: 'tokentx',
		},
		options,
	})
)

/**
 * **`module=account`**, **`action=tokennfttx`** — ERC-721 token transfers by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/tokennfttx
 */
export const getErc721TokenTransfersByAddress = async ({
	publicEnv,
	chainId,
	address,
	offset,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<EtherscanErc721TokenTransfer[] | null> => (
	etherscanAccountListRows<EtherscanErc721TokenTransfer>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action: 'tokennfttx',
		},
		options,
	})
)

/**
 * **`module=account`**, **`action=token1155tx`** — ERC-1155 token transfers by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/token1155tx
 */
export const getErc1155TokenTransfersByAddress = async ({
	publicEnv,
	chainId,
	address,
	offset,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<EtherscanErc1155TokenTransfer[] | null> => (
	etherscanAccountListRows<EtherscanErc1155TokenTransfer>({
		publicEnv,
		chainId,
		query: {
			...etherscanAccountListQuery({
				address,
				offset,
			}),
			action: 'token1155tx',
		},
		options,
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<(
	| {
		standard: 'erc20'
		row: EtherscanErc20TokenTransfer
	}
	| {
		standard: 'erc721'
		row: EtherscanErc721TokenTransfer
	}
	| {
		standard: 'erc1155'
		row: EtherscanErc1155TokenTransfer
	}
)[] | null> => {
	const [
		erc20Rows,
		erc721Rows,
		erc1155Rows,
	] = await Promise.all([
		getErc20TokenTransfersByAddress({
			publicEnv,
			chainId,
			address,
			offset,
			options,
		}),
		getErc721TokenTransfersByAddress({
			publicEnv,
			chainId,
			address,
			offset,
			options,
		}),
		getErc1155TokenTransfersByAddress({
			publicEnv,
			chainId,
			address,
			offset,
			options,
		}),
	])
	if (erc20Rows == null || erc721Rows == null || erc1155Rows == null) return null
	const seen = new Set<string>()
	return [
		...erc20Rows.map((row) => ({
			standard: 'erc20' as const,
			row,
		})),
		...erc721Rows.map((row) => ({
			standard: 'erc721' as const,
			row,
		})),
		...erc1155Rows.map((row) => ({
			standard: 'erc1155' as const,
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<(
	| {
		standard: 'erc20'
		row: EtherscanErc20TokenTransfer
	}
	| {
		standard: 'erc721'
		row: EtherscanErc721TokenTransfer
	}
	| {
		standard: 'erc1155'
		row: EtherscanErc1155TokenTransfer
	}
)[] | null> => {
	const tx = await getTransactionByHash({
		publicEnv,
		chainId,
		txHash,
		options,
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
				)),
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
				options,
			})
		)),
	)
	if (participantRows.some((rows) => rows == null)) return null
	const merged = participantRows.flatMap((rows) => rows ?? [])
	const normalizedTxHash = txHash.toLowerCase()
	const seen = new Set<string>()
	return merged.filter(({ standard, row }) => {
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
 * **`module=account`**, **`action=txlistinternal`** — internal transactions by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlistinternal
 */
export const getInternalTransactionsByAddress = async ({
	publicEnv,
	chainId,
	address,
	offset,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	address: `0x${string}`
	offset: number
	options?: { apiKey?: string }
}): Promise<EtherscanInternalTransaction[] | null> => (
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
		options,
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
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	options?: { apiKey?: string }
}): Promise<EtherscanInternalTransaction[] | null> => (
	etherscanAccountListRows<EtherscanInternalTransaction>({
		publicEnv,
		chainId,
		query: {
			module: 'account',
			action: 'txlistinternal',
			txhash: txHash,
		},
		options,
	})
)
