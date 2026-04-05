// Types
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'


// Constants
const metaEnvRpcUrl = (key: string, fallback: string) => {
	const v = (
		typeof import.meta !== 'undefined' &&
		import.meta.env != null &&
		typeof import.meta.env[key] === 'string' &&
		import.meta.env[key] !== ''
	)
		? String(import.meta.env[key])
	:	fallback
	return v
}

export const evmRpcNetworks = [
	{
		$id: { chainId: 1 },
		name: 'Ethereum',
		nativeSymbol: 'ETH',
		explorerOrigin: 'https://etherscan.io',
		rpcUrl: metaEnvRpcUrl('PUBLIC_EVM_RPC_1', 'https://eth.llamarpc.com'),
	},
	{
		$id: { chainId: 11155111 },
		name: 'Sepolia',
		nativeSymbol: 'ETH',
		explorerOrigin: 'https://sepolia.etherscan.io',
		rpcUrl: metaEnvRpcUrl('PUBLIC_EVM_RPC_11155111', 'https://rpc.sepolia.org'),
	},
] as const satisfies readonly Entity<EntityType.Network>[]


// Lookups
export const evmRpcNetworkByChainId = Object.fromEntries(
	evmRpcNetworks
		.map((row) => [
			String(row.$id.chainId),
			row,
		])
)
