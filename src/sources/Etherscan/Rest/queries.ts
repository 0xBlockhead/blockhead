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
	EtherscanGasOracleWire,
	EtherscanProxyJsonRpcWire,
	EtherscanStringStatusWire,
} from '$/sources/Etherscan/Rest/types.ts'
import type {
	RpcBlockHeaderWire,
	RpcReceiptWire,
	RpcTxWire,
} from '$/sources/Evm/JsonRpc/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import {
	etherscanV2GetJson,
	etherscanV2UnwrapProxyResult,
} from '$/sources/Etherscan/Rest/client.ts'

/**
 * **`module=proxy`**, **`action=eth_getTransactionByHash`**, **`txhash`**.
 *
 * ```bash
 * curl "https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getTransactionByHash&txhash=…&apikey=YourApiKeyToken"
 * ```
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionbyhash
 */
export const proxyEthGetTransactionByHash = async ({
	publicEnv,
	chainId,
	txHash,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	options?: { apiKey?: string }
}): Promise<RpcTxWire | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<RpcTxWire>>({
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
export const proxyEthGetTransactionReceipt = async ({
	publicEnv,
	chainId,
	txHash,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	txHash: `0x${string}`
	options?: { apiKey?: string }
}): Promise<RpcReceiptWire | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<RpcReceiptWire>>({
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
export const proxyEthBlockNumber = async ({
	publicEnv,
	chainId,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	options?: { apiKey?: string }
}): Promise<string | null> => {
	const blockNumberHex = etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<string>>({
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
export const proxyEthGetBlockByNumber = async ({
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
}): Promise<RpcBlockHeaderWire | null> => (
	etherscanV2UnwrapProxyResult(
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<RpcBlockHeaderWire>>({
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
	const wire = await etherscanV2GetJson<EtherscanStringStatusWire>({
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
	const sourceRow = await getContractSourceCodeRow({
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
export const getContractSourceCodeRow = async ({
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
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractSourceCodeWire>({
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
export const getContractCreationRow = async ({
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
	const wire = await etherscanV2GetJson<import('$/sources/Etherscan/Rest/types.ts').EtherscanContractCreationWire>({
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
		?? null
	)
}

/** **`module=proxy`**, **`action=eth_getCode`**. */
export const proxyEthGetCode = async ({
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
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<`0x${string}`>>({
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
export const proxyEthGetStorageAt = async ({
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
		await etherscanV2GetJson<EtherscanProxyJsonRpcWire<`0x${string}`>>({
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
export const gastrackerGasOracle = async ({
	publicEnv,
	chainId,
	options,
}: {
	publicEnv: SourcePublicEnvFor<Source.Etherscan_Rest>
	chainId: number
	options?: { apiKey?: string }
}) => {
	const wire = await etherscanV2GetJson<EtherscanGasOracleWire>({
		chainId,
		publicEnv,
		query: {
			module: 'gastracker',
			action: 'gasoracle',
		},
		options,
	})
	if (wire == null || wire.status !== '1' || wire.result == null) return null
	return wire.result
}
