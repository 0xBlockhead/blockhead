import { describe, expect, it } from 'vitest'

import {
	BitcoinProtocolId,
	bitcoinProtocolById,
	bitcoinProtocols,
} from '$/constants/BitcoinProtocol.ts'
import { NetworkNamespace } from '$/constants/Network.ts'


describe('BitcoinProtocol catalog', () => {
	it('indexes Ordinals and Runes with docs-backed wire markers', () => {
		expect(bitcoinProtocols.map(({ protocol }) => protocol)).toEqual([
			BitcoinProtocolId.Ordinals,
			BitcoinProtocolId.Runes,
		])
		expect(bitcoinProtocolById[BitcoinProtocolId.Ordinals]).toMatchObject({
			networkNamespace: NetworkNamespace.Bitcoin,
			docsUrl: 'https://docs.ordinals.com/inscriptions.html',
			markerHex: '6f7264',
			scriptPrefixHex: '0063036f7264',
		})
		expect(bitcoinProtocolById[BitcoinProtocolId.Runes]).toMatchObject({
			networkNamespace: NetworkNamespace.Bitcoin,
			docsUrl: 'https://docs.ordinals.com/runes.html',
			markerHex: '5d',
			scriptPrefixHex: '6a5d',
			activationHeight: 840_000,
		})
	})

	it('keeps Ordinals / Runes lookup keys exhaustive for protocol extractors', () => {
		expect(Object.keys(bitcoinProtocolById).sort()).toEqual([
			BitcoinProtocolId.Ordinals,
			BitcoinProtocolId.Runes,
		].sort())
		expect(bitcoinProtocolById[BitcoinProtocolId.Ordinals].scriptPrefixHex.startsWith('00')).toBe(true)
		expect(bitcoinProtocolById[BitcoinProtocolId.Runes].scriptPrefixHex).toBe(
			`6a${bitcoinProtocolById[BitcoinProtocolId.Runes].markerHex}`
		)
	})
})
