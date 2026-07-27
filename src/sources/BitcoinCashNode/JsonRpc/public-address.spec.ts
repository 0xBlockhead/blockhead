import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { getTransparentAddressUtxos } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')

const binding = bindings[Source.BitcoinCashNode_JsonRpc]

const address = `bitcoincash:q${'q'.repeat(41)}`

describe('Bitcoin Cash Node public address transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads exact CashToken-bearing UTXOs without wallet RPC', async () => {
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
			istokenaware: false,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: true,
			unspents: [{
				txid: 'a'.repeat(64),
				vout: 1,
				scriptPubKey: '76a91400',
				amount: 1.23456789,
				height: 850_000,
				tokenData: {
					category: 'b'.repeat(64),
					amount: '18446744073709551615',
					nft: {
						capability: 'mutable',
						commitment: 'c0ffee',
					},
				},
			}],
			total_amount: 1.23456789,
			token_total_amount: {
				['b'.repeat(64)]: '18446744073709551615',
			},
		})

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			unspents: [{
				valueZatoshis: 123_456_789n,
				tokenData: {
					amount: '18446744073709551615',
				},
			}],
			totalAmountZatoshis: 123_456_789n,
			tokenTotalAmountByCategory: {
				['b'.repeat(64)]: 18_446_744_073_709_551_615n,
			},
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			binding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	})

	it('rejects duplicate, lossy, malformed, incomplete, and oversized scans', async () => {
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: false,
			unspents: [],
			total_amount: 0,
		})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('did not complete')

		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: true,
			unspents: [
				{
					txid: 'a'.repeat(64),
					vout: 0,
					scriptPubKey: '',
					amount: 1,
					height: 1,
				},
				{
					txid: 'a'.repeat(64),
					vout: 0,
					scriptPubKey: '',
					amount: 1,
					height: 1,
				},
			],
			total_amount: 2,
		})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 2,
		})).rejects.toThrow('duplicate UTXO outpoint')

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 10_001,
		})).rejects.toThrow('0 through 10000')
		expect(jsonRpc2).toHaveBeenCalledTimes(4)
	})

	it('does not transport zero-cardinality scans', async () => {
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 0,
		})).resolves.toMatchObject({
			unspents: [],
		})
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
