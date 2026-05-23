// Types

export enum EvmTokenStandard {
	Erc20 = 'ERC-20',
	Erc721 = 'ERC-721',
	Erc1155 = 'ERC-1155',
}


// Constants

export const evmTokenStandards = [
	EvmTokenStandard.Erc20,
	EvmTokenStandard.Erc721,
	EvmTokenStandard.Erc1155,
] as const satisfies readonly EvmTokenStandard[]


// Lookups

export const evmTokenStandardLabelById = {
	[EvmTokenStandard.Erc20]: 'ERC-20',
	[EvmTokenStandard.Erc721]: 'ERC-721',
	[EvmTokenStandard.Erc1155]: 'ERC-1155',
} as const satisfies Record<EvmTokenStandard, string>
