import { describe, expect, it } from 'vitest'

import {
	bitcoinInscriptionId,
	bitcoinOrdinalInscriptionRefsFromPayloads,
	bitcoinOrdinalInscriptionRefsFromUtxoInscriptions,
	bitcoinOrdinalInscriptionSnapshotFromPayload,
	bitcoinRunestoneRefFromPayloads,
	bitcoinRunestoneSnapshotFromPayload,
	ordinalsPayloads,
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
		expect(parseBitcoinInscriptionId('i0')).toBeUndefined()
		expect(parseBitcoinInscriptionId('abi')).toBeUndefined()
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
				contentType: 'text/plain',
				bodyHex: '4869',
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
		expect(ordinalsPayloads([...payloads])).toHaveLength(1)
		expect(runestonePayload([...payloads])?.location.outputIndex).toBe(2)
		expect(
			bitcoinRunestoneRefFromPayloads({
				$network: network,
				txId: 'aa'.repeat(32),
			}, [...payloads])
		).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: 'aa'.repeat(32),
				},
				outputIndex: 2,
			},
		})
	})

	it('builds inscription and runestone detail snapshots from protocol payloads', () => {
		const network = {
			slug: 'bitcoin' as const,
		}
		const $transaction = {
			$network: network,
			txId: 'aa'.repeat(32),
		}
		const ordinal = {
			protocol: BitcoinProtocolId.Ordinals,
			transactionId: 'aa'.repeat(32),
			location: {
				inputIndex: 1,
				witnessIndex: 0,
			},
			payloadHex: '01',
			contentType: 'text/plain',
			bodyHex: '4869',
		} as const
		const runestone = {
			protocol: BitcoinProtocolId.Runes,
			transactionId: 'aa'.repeat(32),
			location: {
				outputIndex: 3,
			},
			payloadHex: 'aabb',
			isCenotaph: true,
		} as const

		expect(
			bitcoinOrdinalInscriptionSnapshotFromPayload(
				network,
				`${'aa'.repeat(32)}i0`,
				0,
				ordinal
			)
		).toEqual({
			inscriptionId: `${'aa'.repeat(32)}i0`,
			inscriptionIndex: 0,
			$revealTransaction: {
				[EntityMetaKey.Selector]: {
					$network: network,
					txId: 'aa'.repeat(32),
				},
			},
			revealInputIndex: 1,
			revealWitnessIndex: 0,
			contentType: 'text/plain',
			bodyHex: '4869',
			payloadHex: '01',
		})
		expect(bitcoinRunestoneSnapshotFromPayload($transaction, runestone)).toEqual({
			outputIndex: 3,
			$output: {
				[EntityMetaKey.Selector]: {
					$transaction,
					indexInTransaction: 3,
				},
			},
			payloadHex: 'aabb',
			isCenotaph: true,
		})
	})

	it('builds inscription refs from UniSat utxo inscription rows', () => {
		const network = {
			slug: 'bitcoin' as const,
		}
		expect(
			bitcoinOrdinalInscriptionRefsFromUtxoInscriptions(network, [
				{
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
				{
					inscriptionId: `${'bb'.repeat(32)}i2`,
				},
			])
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${'bb'.repeat(32)}i2`,
				},
			},
		])
	})
})
