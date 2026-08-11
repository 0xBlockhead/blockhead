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
	EtherscanContractCreation,
	EtherscanContractSourceCode,
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
	etherscanV2GetJson as executeEtherscanV2GetJson,
	etherscanV2GetProxyResult as executeEtherscanV2GetProxyResult,
	etherscanV2UnwrapAccountResultArray,
} from '$/sources/Etherscan/Rest/client.ts'
import {
	accountListMaxOffset,
	contractCreationAbsentMessages,
	contractUnverifiedMessages,
	supportedChainIds,
} from '$/sources/Etherscan/Rest/constants.ts'
import bindings from '$/sources/Etherscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const contractUnverifiedMessageSet = new Set<string>(contractUnverifiedMessages)
const contractCreationAbsentMessageSet = new Set<string>(contractCreationAbsentMessages)

export const supportsChainId = (chainId: number) => (
	supportedChainIds.some((supportedChainId) => supportedChainId === chainId)
)

/** Re-export catalog cap for resolvers that page account lists. */
export const getAccountListMaxOffset = accountListMaxOffset

const requireTxHash = (txHash: string) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null)
		throw new Error(`Etherscan_Rest: invalid tx hash ${txHash}`)
	return normalizedTxHash
}

const requireHexQuantity = (value: string | null, label: string) => {
	if (value == null || !/^0x[0-9a-f]+$/i.test(value))
		throw new Error(`Etherscan_Rest: invalid ${label} quantity ${String(value)}`)
	return value
}

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
	offset: String(Math.min(Math.max(1, offset), accountListMaxOffset)),
	sort: 'desc',
})

export const etherscanQueries = (() => {
	const binding = bindings[Source.Etherscan_Rest][0]
	const etherscanV2GetJson = <_Result>(request: Omit<Parameters<typeof executeEtherscanV2GetJson<_Result>>[0], 'binding'>) => (
		executeEtherscanV2GetJson<_Result>({ binding, ...request })
	)
	const etherscanV2GetProxyResult = <_Result>(request: Omit<Parameters<typeof executeEtherscanV2GetProxyResult<_Result>>[0], 'binding'>) => (
		executeEtherscanV2GetProxyResult<_Result>({ binding, ...request })
	)

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
	const getTransactionByHash = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
	}) => {
		const requestedTxHash = requireTxHash(txHash)
		const transaction = await etherscanV2GetProxyResult<RpcTransaction>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getTransactionByHash',
				txhash: requestedTxHash,
			},
		})
		if (
			transaction?.hash != null
			&& hexLowerOfByteSize(transaction.hash, 32) !== requestedTxHash
		)
			throw new Error('Etherscan_Rest: transaction subject mismatch')

		return transaction
	}
/**
 * **`module=proxy`**, **`action=eth_getTransactionReceipt`**, **`txhash`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionreceipt
 */
	const getTransactionReceipt = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
	}) => {
		const requestedTxHash = requireTxHash(txHash)
		const receipt = await etherscanV2GetProxyResult<RpcReceipt>({
			chainId,
			publicEnv,
			query: {
				module: 'proxy',
				action: 'eth_getTransactionReceipt',
				txhash: requestedTxHash,
			},
		})
		if (
			receipt?.transactionHash != null
			&& hexLowerOfByteSize(receipt.transactionHash, 32) !== requestedTxHash
		)
			throw new Error('Etherscan_Rest: transaction receipt subject mismatch')

		return receipt
	}

/**
 * **`module=proxy`**, **`action=eth_blockNumber`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethblocknumber
 */
	const getBlockNumber = async ({
		publicEnv,
		chainId,
	}: {
		publicEnv: SourcePublicEnv
		chainId: number
	}) => (
		requireHexQuantity(
			await etherscanV2GetProxyResult<string>({
				chainId,
				publicEnv,
				query: {
					module: 'proxy',
					action: 'eth_blockNumber',
				},
			}),
			'block number'
		)
	)

/**
 * **`module=proxy`**, **`action=eth_getBlockByNumber`**, **`tag`** (hex block number or **`latest`**), **`boolean`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgetblockbynumber
 */
	const getBlockByNumber = async ({
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
}) => {
	const block = await etherscanV2GetProxyResult<RpcBlockHeader>({
		chainId,
		publicEnv,
		query: {
			module: 'proxy',
			action: 'eth_getBlockByNumber',
			tag,
			boolean: includeTransactions ? 'true' : 'false',
		},
	})
	if (blockNumber != null && block != null) {
		try {
			if (BigInt(block.number ?? '') !== blockNumber)
				throw new Error('Etherscan_Rest: block response does not match the subject')
		} catch (error) {
			if (error instanceof Error && error.message === 'Etherscan_Rest: block response does not match the subject')
				throw error
			throw new Error('Etherscan_Rest: block response has an invalid number')
		}
	}

	return block
}

/**
 * **`module=contract`**, **`action=getabi`**, **`address`**.
 * Returns parsed ABI JSON string from **`result`**, or **`null`** if unverified / error.
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */
	const getContractAbiJsonString = async ({
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
	if (wire.status === '1' && wire.result.trim())
		return wire.result
	if (
		wire.status === '0'
		&& (
			contractUnverifiedMessageSet.has(wire.message)
			|| contractUnverifiedMessageSet.has(wire.result)
		)
	) {
		const sourceRow = await getContractSourceCode({
			publicEnv,
			chainId,
			address,
		})
		const abi = sourceRow?.ABI
		return typeof abi === 'string' && abi.trim() ? abi : null
	}
	throw new Error(
		`Etherscan_Rest: getabi failed${
			wire.result !== '' ?
				`: ${wire.result}`
			: wire.message !== '' ?
				`: ${wire.message}`
			:
				''
		}`
	)
}

/**
 * **`module=contract`**, **`action=getsourcecode`**, **`address`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/getsourcecode
 */
	const getContractSourceCode = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => {
	const wire = await etherscanV2GetJson<EtherscanContractSourceCode>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getsourcecode',
			address,
		},
	})
	if (wire.status === '1')
		return wire.result[0] ?? null
	if (
		wire.status === '0'
		&& (
			(
				typeof wire.result === 'string'
				&& contractUnverifiedMessageSet.has(wire.result)
			)
			|| contractUnverifiedMessageSet.has(wire.message)
		)
	)
		return null
	throw new Error(
		`Etherscan_Rest: getsourcecode failed${
			typeof wire.result === 'string' && wire.result !== '' ?
				`: ${wire.result}`
			: wire.message !== '' ?
				`: ${wire.message}`
			:
				''
		}`
	)
}

/**
 * **`module=contract`**, **`action=getcontractcreation`**, **`contractaddresses`**.
 * @see https://docs.etherscan.io/api-reference/endpoint/getcontractcreation
 */
	const getContractCreation = async ({
	publicEnv,
	chainId,
	address,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	address: `0x${string}`
}) => {
	const wire = await etherscanV2GetJson<EtherscanContractCreation>({
		chainId,
		publicEnv,
		query: {
			module: 'contract',
			action: 'getcontractcreation',
			contractaddresses: address,
		},
	})
	if (wire.status === '1')
		return (
			wire.result.find((row) => (
				row.contractAddress.toLowerCase() === address.toLowerCase()
			))
			?? null
		)
	if (
		contractCreationAbsentMessageSet.has(wire.message)
		|| contractCreationAbsentMessageSet.has(wire.result)
	)
		return null
	throw new Error(
		`Etherscan_Rest: getcontractcreation failed${
			typeof wire.result === 'string' && wire.result !== '' ?
				`: ${wire.result}`
			: wire.message !== '' ?
				`: ${wire.message}`
			:
				''
		}`
	)
}

/** **`module=proxy`**, **`action=eth_getCode`**. */
	const getCode = async ({
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
	const getStorageAt = async ({
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
	const getGasOracle = async ({
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
	if (wire.status !== '1')
		throw new Error(
			`Etherscan_Rest: gasoracle failed${
				typeof wire.result === 'string' ?
					`: ${wire.result}`
				: wire.message !== '' ?
					`: ${wire.message}`
				:
					''
			}`
		)
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
	const getTokenTransfersByAddress = async ({
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

const erc20Or721TransferTopic0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const erc1155TransferSingleTopic0 = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'

const addressFromIndexedTopic = (
	topic: string | undefined
) => (
	topic == null || topic.length < 42 ?
		undefined
	:
		hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
)

const uintStringFromDataWord = (
	data: string | undefined,
	wordIndex: number
) => {
	if (data == null || data === '' || data === '0x') return undefined
	const hex = data.startsWith('0x') || data.startsWith('0X') ? data.slice(2) : data
	const word = hex.slice(wordIndex * 64, wordIndex * 64 + 64)
	if (word.length !== 64) return undefined
	try {
		return BigInt(`0x${word}`).toString()
	} catch {
		return undefined
	}
}

/**
 * Token transfers within one transaction — derived from **`eth_getTransactionReceipt`** logs
 * (Etherscan has no `tokentx`/`tokennfttx`/`token1155tx` by tx hash).
 */
	const getTokenTransfersByTransaction = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
}) => {
	const normalizedTxHash = requireTxHash(txHash)

	const receipt = await getTransactionReceipt({
		publicEnv,
		chainId,
		txHash: normalizedTxHash,
	})
	if (receipt == null)
		return []

	return (receipt.logs ?? []).flatMap((log): EtherscanTokenTransferTagged[] => {
		const topic0 = log.topics?.[0]?.toLowerCase()
		const contractAddress = hexLowerOfByteSize(log.address ?? '', 20)
		const shared = {
			hash: normalizedTxHash,
			blockNumber: log.blockNumber,
			blockHash: log.blockHash,
			transactionIndex: log.transactionIndex,
			logIndex: log.logIndex,
			...(contractAddress != null && { contractAddress }),
		}

		if (topic0 === erc20Or721TransferTopic0) {
			const from = addressFromIndexedTopic(log.topics?.[1])
			const to = addressFromIndexedTopic(log.topics?.[2])
			const tokenIdTopic = log.topics?.[3]
			if (tokenIdTopic != null) {
				const tokenID = uintStringFromDataWord(tokenIdTopic, 0)
				if (tokenID == null) return []
				return [{
					standard: 'erc721',
					row: {
						...shared,
						...(from != null && { from }),
						...(to != null && { to }),
						tokenID,
					},
				}]
			}
			const value = uintStringFromDataWord(log.data, 0)
			if (value == null) return []
			return [{
				standard: 'erc20',
				row: {
					...shared,
					...(from != null && { from }),
					...(to != null && { to }),
					value,
				},
			}]
		}

		if (topic0 === erc1155TransferSingleTopic0) {
			const from = addressFromIndexedTopic(log.topics?.[2])
			const to = addressFromIndexedTopic(log.topics?.[3])
			const tokenID = uintStringFromDataWord(log.data, 0)
			const tokenValue = uintStringFromDataWord(log.data, 1)
			if (tokenID == null || tokenValue == null) return []
			return [{
				standard: 'erc1155',
				row: {
					...shared,
					...(from != null && { from }),
					...(to != null && { to }),
					tokenID,
					tokenValue,
				},
			}]
		}

		return []
	})
}

/**
 * **`module=account`**, **`action=txlist`** — normal transactions by address.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlist
 */
	const getTransactionsByAddress = ({
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
	const getInternalTransactionsByAddress = ({
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
	const getInternalTransactionsByTxHash = async ({
	publicEnv,
	chainId,
	txHash,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
	txHash: string
}) => (
	etherscanAccountListRows<EtherscanInternalTransaction>({
		publicEnv,
		chainId,
		query: {
			module: 'account',
			action: 'txlistinternal',
			txhash: requireTxHash(txHash),
		},
	})
)

	return {
		getBlockByNumber,
		getBlockNumber,
		getCode,
		getContractAbiJsonString,
		getContractCreation,
		getContractSourceCode,
		getGasOracle,
		getInternalTransactionsByAddress,
		getInternalTransactionsByTxHash,
		getStorageAt,
		getTokenTransfersByAddress,
		getTokenTransfersByTransaction,
		getTransactionByHash,
		getTransactionReceipt,
		getTransactionsByAddress,
	}
})()
