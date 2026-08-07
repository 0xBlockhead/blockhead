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
	chainId: number,
	{
		fastTransferSource,
		forwardingDestination,
	}: {
		fastTransferSource: boolean
		forwardingDestination: boolean
	}
) => ({
	cctpVersion: irisCctpVersion,
	domainId,
	name,
	chainId,
	tokenMessengerAddress: TOKEN_MESSENGER_V2,
	messageTransmitterAddress: MESSAGE_TRANSMITTER_V2,
	tokenMinterAddress: TOKEN_MINTER_V2,
	supportedTokens: ['USDC'] as const,
	standardTransferSource: true,
	fastTransferSource,
	forwardingDestination,
})

/**
 * Circle CCTP V2 mainnet EVM domain / contract catalog.
 * Capability flags mirror Circle's supported-chains-and-domains table.
 * @see https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 * @see https://developers.circle.com/cctp/references/contract-addresses
 */
export const evmDomainSupports = [
	standardEvm(0, 'Ethereum', 1, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(1, 'Avalanche', 43114, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(2, 'OP Mainnet', 10, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(3, 'Arbitrum', 42161, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(6, 'Base', 8453, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(7, 'Polygon PoS', 137, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(10, 'Unichain', 130, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(11, 'Linea', 59144, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(12, 'Codex', 81224, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(13, 'Sonic', 146, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(14, 'World Chain', 480, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(15, 'Monad', 143, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(16, 'Sei', 1329, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(18, 'XDC', 50, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(19, 'HyperEVM', 999, {
		fastTransferSource: false,
		forwardingDestination: true,
	}),
	standardEvm(21, 'Ink', 57073, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	standardEvm(22, 'Plume', 98866, {
		fastTransferSource: true,
		forwardingDestination: true,
	}),
	{
		cctpVersion: irisCctpVersion,
		domainId: 28,
		name: 'EDGE',
		chainId: 3343,
		tokenMessengerAddress: zeroExLowerCase('0x98706A006bc632Df31CAdFCBD43F38887ce2ca5c'),
		messageTransmitterAddress: zeroExLowerCase('0x5b61381Fc9e58E70EfC13a4A97516997019198ee'),
		tokenMinterAddress: zeroExLowerCase('0x338Dfd607855BeEc17f33e539Ac2479853cC8384'),
		supportedTokens: ['USDC'],
		standardTransferSource: true,
		fastTransferSource: true,
		forwardingDestination: true,
	},
	standardEvm(29, 'Injective', 1776, {
		fastTransferSource: false,
		forwardingDestination: false,
	}),
	standardEvm(30, 'Morph', 2818, {
		fastTransferSource: true,
		forwardingDestination: false,
	}),
	standardEvm(31, 'Pharos', 1672, {
		fastTransferSource: false,
		forwardingDestination: false,
	}),
	standardEvm(32, 'Cronos', 25, {
		fastTransferSource: false,
		forwardingDestination: false,
	}),
] as const

/**
 * Circle CCTP V2 Solana program catalog (domain 5).
 * @see https://developers.circle.com/cctp/references/solana-programs
 * @see https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 */
export const solanaDomainSupports = [
	{
		cctpVersion: irisCctpVersion,
		domainId: 5,
		name: 'Solana',
		tokenMessengerAddress: 'CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe',
		messageTransmitterAddress: 'CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC',
		supportedTokens: ['USDC'],
		standardTransferSource: true,
		fastTransferSource: true,
		forwardingDestination: true,
		caip2: {
			namespace: 'solana' as const,
			reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
	},
] as const

/**
 * Circle CCTP V2 Stellar contract catalog (domain 27).
 * `forwardingDestination` marks Stellar CctpForwarder destination handling, not Circle Forwarding Service.
 * @see https://developers.circle.com/cctp/references/stellar-contracts
 * @see https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 */
export const stellarDomainSupports = [
	{
		cctpVersion: irisCctpVersion,
		domainId: 27,
		name: 'Stellar',
		tokenMessengerAddress: 'CAE2G5Z77UP7GYPYGFOWFGW7C7J6I4YP2AFGSADRKQY62SYUFLPNFTXL',
		messageTransmitterAddress: 'CACMENFFJPJMSDAJQLX4R7K3SFZIW2LJSE3R2UMLGSWHFHS353FVXAZV',
		supportedTokens: ['USDC'],
		standardTransferSource: true,
		fastTransferSource: false,
		forwardingDestination: true,
		networkSlug: 'stellar',
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
