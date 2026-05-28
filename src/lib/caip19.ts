import { caip2FromEvmChainId } from '$/lib/caip.ts'

export const Slip44 = {
	Ether: 60,
} as const

export const caip19Erc20 = (chainId: number, tokenAddress: `0x${string}`) => (
	`${caip2FromEvmChainId(chainId)}/erc20:${tokenAddress.toLowerCase()}`
)

export const caip19Slip44 = (chainId: number, slip44: number) => (
	`${caip2FromEvmChainId(chainId)}/slip44:${slip44}`
)
