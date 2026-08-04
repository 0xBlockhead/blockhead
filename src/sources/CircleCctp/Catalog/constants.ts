import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'


// Constants


/**
 * Circle CCTP V2 Iris protocol version used by the contract catalog and Iris REST surface.
 * @see https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 */
export const irisCctpVersion = 2

const TOKEN_MESSENGER_V2 = zeroExLowerCase('0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d')
const MESSAGE_TRANSMITTER_V2 = zeroExLowerCase('0x81D40F21F12A8F0E3252Bccb954D722d4c464B64')
const TOKEN_MINTER_V2 = zeroExLowerCase('0xfd78EE919681417d192449715b2594ab58f5D002')

const standardEvm = (
	domainId: number,
	name: string,
	chainId: number
) => ({
	cctpVersion: irisCctpVersion,
	domainId,
	name,
	chainId,
	tokenMessengerAddress: TOKEN_MESSENGER_V2,
	messageTransmitterAddress: MESSAGE_TRANSMITTER_V2,
	tokenMinterAddress: TOKEN_MINTER_V2,
	supportedTokens: ['USDC'] as const,
})

/**
 * Circle CCTP V2 mainnet EVM domain / contract catalog.
 * @see https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 * @see https://developers.circle.com/cctp/references/contract-addresses
 */
export const evmDomainSupports = [
	standardEvm(0, 'Ethereum', 1),
	standardEvm(1, 'Avalanche', 43114),
	standardEvm(2, 'OP Mainnet', 10),
	standardEvm(3, 'Arbitrum', 42161),
	standardEvm(6, 'Base', 8453),
	standardEvm(7, 'Polygon PoS', 137),
	standardEvm(10, 'Unichain', 130),
	standardEvm(11, 'Linea', 59144),
	standardEvm(12, 'Codex', 81224),
	standardEvm(13, 'Sonic', 146),
	standardEvm(14, 'World Chain', 480),
	standardEvm(15, 'Monad', 143),
	standardEvm(16, 'Sei', 1329),
	standardEvm(18, 'XDC', 50),
	standardEvm(19, 'HyperEVM', 999),
	standardEvm(21, 'Ink', 57073),
	standardEvm(22, 'Plume', 98866),
	{
		cctpVersion: irisCctpVersion,
		domainId: 28,
		name: 'EDGE',
		chainId: 3343,
		tokenMessengerAddress: zeroExLowerCase('0x98706A006bc632Df31CAdFCBD43F38887ce2ca5c'),
		messageTransmitterAddress: zeroExLowerCase('0x5b61381Fc9e58E70EfC13a4A97516997019198ee'),
		tokenMinterAddress: zeroExLowerCase('0x338Dfd607855BeEc17f33e539Ac2479853cC8384'),
		supportedTokens: ['USDC'],
	},
	standardEvm(29, 'Injective', 1776),
	standardEvm(30, 'Morph', 2818),
	standardEvm(31, 'Pharos', 1672),
	standardEvm(32, 'Cronos', 25),
] as const

/**
 * Circle CCTP V2 Solana program catalog (domain 5).
 * @see https://developers.circle.com/cctp/references/solana-programs
 */
export const solanaDomainSupports = [
	{
		cctpVersion: irisCctpVersion,
		domainId: 5,
		name: 'Solana',
		tokenMessengerAddress: 'CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe',
		messageTransmitterAddress: 'CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC',
		supportedTokens: ['USDC'],
		caip2: {
			namespace: 'solana' as const,
			reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
	},
] as const

/**
 * Circle CCTP V2 Stellar contract catalog (domain 27).
 * @see https://developers.circle.com/cctp/references/stellar-contracts
 */
export const stellarDomainSupports = [
	{
		cctpVersion: irisCctpVersion,
		domainId: 27,
		name: 'Stellar',
		tokenMessengerAddress: 'CAE2G5Z77UP7GYPYGFOWFGW7C7J6I4YP2AFGSADRKQY62SYUFLPNFTXL',
		messageTransmitterAddress: 'CACMENFFJPJMSDAJQLX4R7K3SFZIW2LJSE3R2UMLGSWHFHS353FVXAZV',
		supportedTokens: ['USDC'],
		networkSlug: 'stellar',
		forwardingDestination: true,
	},
] as const


// Lookups


export const evmDomainSupportByDomainId = Object.fromEntries(
	evmDomainSupports.map((row) => [
		row.domainId,
		row,
	])
)

export const solanaDomainSupportByDomainId = Object.fromEntries(
	solanaDomainSupports.map((row) => [
		row.domainId,
		row,
	])
)

export const stellarDomainSupportByDomainId = Object.fromEntries(
	stellarDomainSupports.map((row) => [
		row.domainId,
		row,
	])
)

export const solanaDomainSupport = solanaDomainSupports[0]
export const stellarDomainSupport = stellarDomainSupports[0]
