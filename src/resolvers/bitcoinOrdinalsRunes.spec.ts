import { describe, expect, it } from 'vitest'

import {
	bitcoinInscriptionId,
	bitcoinOrdinalInscriptionRefsFromPayloads,
	parseBitcoinInscriptionId,
	runestonePayload,
} from '$/resolvers/bitcoinOrdinalsRunes.ts'
import { BitcoinProtocolId } from '$/constants/BitcoinProtocol.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'


describe('bitcoinOrdinalsRunes helpers', () => {
	it('parses and formats inscription ids', () => {
		expect(bitcoinInscriptionId('aa'.repeat(32), 3)).toBe(`${'aa'.repeat(32)}i3`)
		expect(parseBitcoinInscriptionId(`${'aa'.repeat(32)}i3`)).toEqual({
			txId: 'aa'.repeat(32),
			inscriptionIndex: 3,
		})
		expect(parseBitcoinInscriptionId('not-an-id')).toBeUndefined()
	})

	it('builds inscription refs and finds the runestone payload', () => {
		const network = {
			slug: 'bitcoin' as const,
		}
		const payloads = [
			{
				protocol: BitcoinProtocolId.Ordinals,
				transactionId: 'aa'.repeat(32),
				location: {
					inputIndex: 0,
					witnessIndex: 1,
				},
				payloadHex: '01',
			},
			{
				protocol: BitcoinProtocolId.Runes,
				transactionId: 'aa'.repeat(32),
				location: {
					outputIndex: 2,
				},
				payloadHex: '0102',
				isCenotaph: false,
			},
		] as const

		expect(
			bitcoinOrdinalInscriptionRefsFromPayloads(network, [...payloads])
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
			},
		])
		expect(runestonePayload([...payloads])?.location.outputIndex).toBe(2)
	})
})
