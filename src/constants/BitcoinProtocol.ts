import { NetworkNamespace } from '$/constants/Network.ts'


// Types

export enum BitcoinProtocolId {
	Ordinals = 'Ordinals',
	Runes = 'Runes',
}

type BitcoinProtocol = {
	protocol: BitcoinProtocolId
	label: string
	networkNamespace: NetworkNamespace.Bitcoin
	docsUrl: string
	homeUrl: string
	protocolName: string
	registryLabel: string
	topology: string
	/**
	 * Canonical script marker bytes (hex, no `0x`).
	 * Ordinals: ASCII `ord` inside an `OP_FALSE OP_IF` envelope.
	 * Runes: bare `OP_13` after `OP_RETURN` (not a data push).
	 */
	markerHex: string
	/**
	 * Prefix used to locate protocol payloads in script hex.
	 * Ordinals: `OP_FALSE OP_IF PUSH "ord"`.
	 * Runes: `OP_RETURN OP_13`.
	 */
	scriptPrefixHex: string
	/** Mainnet activation height when protocol messages become valid. Absent = genesis-valid. */
	activationHeight?: number
}


// Constants

/**
 * Overlay protocols on Bitcoin mainnet UTXO scripts.
 * Wire refs: https://docs.ordinals.com/inscriptions.html , https://docs.ordinals.com/runes/specification.html
 * (`ord` is normative for Runes).
 */
export const bitcoinProtocols = [
	{
		protocol: BitcoinProtocolId.Ordinals,
		label: 'Bitcoin Ordinals',
		networkNamespace: NetworkNamespace.Bitcoin,
		docsUrl: 'https://docs.ordinals.com/inscriptions.html',
		homeUrl: 'https://ordinals.com/',
		protocolName: 'Ordinals',
		registryLabel: 'Inscription envelopes in taproot witness scripts',
		topology: 'Reveal witness envelope (OP_FALSE OP_IF … PUSH "ord" … OP_ENDIF) -> content-type + body tags',
		markerHex: '6f7264',
		scriptPrefixHex: '0063036f7264',
	},
	{
		protocol: BitcoinProtocolId.Runes,
		label: 'Bitcoin Runes',
		networkNamespace: NetworkNamespace.Bitcoin,
		docsUrl: 'https://docs.ordinals.com/runes.html',
		homeUrl: 'https://ordinals.com/',
		protocolName: 'Runes',
		registryLabel: 'Runestone OP_RETURN messages (OP_RETURN OP_13)',
		topology: 'First OP_RETURN OP_13 output -> concatenated data pushes -> LEB128 runestone fields',
		markerHex: '5d',
		scriptPrefixHex: '6a5d',
		activationHeight: 840_000,
	},
] as const satisfies readonly BitcoinProtocol[]


// Lookups

export const bitcoinProtocolById = Object.fromEntries(
	bitcoinProtocols.map((protocol) => [
		protocol.protocol,
		protocol,
	])
)
