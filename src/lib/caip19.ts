export const Slip44 = {
	Ether: 60,
} as const

export const caip19Erc20 = (chainId: number, tokenAddress: `0x${string}`) => (
	`eip155:${chainId}/erc20:${tokenAddress.toLowerCase()}`
)

export const caip19Slip44 = (chainId: number, slip44: number) => (
	`eip155:${chainId}/slip44:${slip44}`
)
