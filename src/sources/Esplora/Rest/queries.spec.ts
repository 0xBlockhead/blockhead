import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Esplora/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getBlock,
	getTransactionProtocolPayloads,
} = await import('$/sources/Esplora/Rest/queries.ts')

const bitcoinBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Caip2Network
))
const liquidBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.NetworkSlug
))
if (bitcoinBinding == null || liquidBinding == null)
	throw new Error('Esplora spec requires Bitcoin and Liquid bindings')

describe('Esplora REST binding selection', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('selects the exact target binding and preserves its API prefix', async () => {
		await getBlock({
			blockHash: 'bitcoin-block',
			target: bitcoinBinding.target.key,
		})
		await getBlock({
			blockHash: 'liquid-block',
			target: liquidBinding.target.key,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://blockstream.info/api/block/bitcoin-block',
			],
			[
				liquidBinding,
				'https://blockstream.info/liquid/api/block/liquid-block',
			],
		])
	})

	it('getTransactionProtocolPayloads extracts Ordinals + Runes from the Esplora tx wire', async () => {
		const txId = 'aa'.repeat(32)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			fee: 100,
			vin: [
				{
					txid: 'bb'.repeat(32),
					vout: 0,
					prevout: null,
					scriptsig: '',
					scriptsig_asm: '',
					witness: [
						'0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c642168',
					],
					is_coinbase: false,
					sequence: 0xffffffff,
				},
			],
			vout: [
				{
					scriptpubkey: '6a5d03020100',
					scriptpubkey_asm: '',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
			status: {
				confirmed: true,
			},
		})

		const payloads = await getTransactionProtocolPayloads({
			target: bitcoinBinding.target.key,
			txId,
		})

		expect(payloads).toHaveLength(2)
		expect(payloads[0]).toMatchObject({
			protocol: 'Ordinals',
			transactionId: txId,
			contentType: 'text/plain;charset=utf-8',
		})
		expect(payloads[1]).toMatchObject({
			protocol: 'Runes',
			transactionId: txId,
			payloadHex: '020100',
			isCenotaph: false,
		})
	})

	it('getTransactionProtocolPayloads marks LEB128 Cenotaph-tag runestones', async () => {
		const txId = 'ff'.repeat(32)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 50,
			weight: 200,
			vin: [],
			vout: [
				{
					scriptpubkey: '6a5d037e0000',
					scriptpubkey_asm: '',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
			status: {
				confirmed: false,
			},
		})

		await expect(
			getTransactionProtocolPayloads({
				target: bitcoinBinding.target.key,
				txId,
			})
		).resolves.toEqual([
			{
				protocol: 'Runes',
				transactionId: txId,
				location: {
					outputIndex: 0,
				},
				payloadHex: '7e0000',
				isCenotaph: true,
			},
		])
	})
})
