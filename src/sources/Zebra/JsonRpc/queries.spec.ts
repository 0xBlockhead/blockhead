import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getTransparentAddressTransactionIds,
	getTransparentAddressUtxos,
} = await import('$/sources/Zebra/JsonRpc/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Zebra_JsonRpc)

if (binding == null)
	throw new Error('Zebra_JsonRpc spec missing source binding')

const address = `t1${'A'.repeat(33)}`

describe('Zebra transparent-address transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads bounded, account-owned UTXOs with exact zatoshi integers', async () => {
		jsonRpc2.mockResolvedValueOnce({
			utxos: [{
				address,
				txid: 'a'.repeat(64),
				height: 2_800_000,
				outputIndex: 1,
				script: '76a91400',
				satoshis: 2_100_000_000_000_000,
			}],
			hash: 'b'.repeat(64),
			height: 2_800_001,
		})

		await expect(getTransparentAddressUtxos(binding, {
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			utxos: [{
				satoshis: 2_100_000_000_000_000,
			}],
		})
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'getaddressutxos',
			[{
				addresses: [address],
				chainInfo: true,
			}]
		)
	})

	it('bounds transaction history by an exact inclusive block window', async () => {
		jsonRpc2.mockResolvedValueOnce([
			'c'.repeat(64),
			'd'.repeat(64),
		])

		await expect(getTransparentAddressTransactionIds(binding, {
			address,
			startHeight: 2_790_000,
			endHeight: 2_799_999,
			maxResults: 25,
		})).resolves.toHaveLength(2)
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'getaddresstxids',
			[{
				addresses: [address],
				start: 2_790_000,
				end: 2_799_999,
			}]
		)
	})

	it('rejects foreign, duplicate, lossy, malformed, and oversized results', async () => {
		jsonRpc2.mockResolvedValueOnce({
			utxos: [{
				address: `t3${'B'.repeat(33)}`,
				txid: 'a'.repeat(64),
				height: 1,
				outputIndex: 0,
				script: '',
				satoshis: 1,
			}],
			hash: 'b'.repeat(64),
			height: 1,
		})
		await expect(getTransparentAddressUtxos(binding, {
			address,
			maxResults: 1,
		})).rejects.toThrow('foreign address row')

		jsonRpc2.mockResolvedValueOnce([
			'c'.repeat(64),
			'c'.repeat(64),
		])
		await expect(getTransparentAddressTransactionIds(binding, {
			address,
			startHeight: 1,
			endHeight: 2,
			maxResults: 2,
		})).rejects.toThrow('duplicate transparent transaction ID')

		await expect(getTransparentAddressTransactionIds(binding, {
			address,
			startHeight: 1,
			endHeight: 10_001,
			maxResults: 1,
		})).rejects.toThrow('1 through 10000 blocks')
		expect(jsonRpc2).toHaveBeenCalledTimes(2)
	})

	it('does not transport zero-cardinality requests', async () => {
		await expect(getTransparentAddressUtxos(binding, {
			address,
			maxResults: 0,
		})).resolves.toMatchObject({
			utxos: [],
		})
		await expect(getTransparentAddressTransactionIds(binding, {
			address,
			startHeight: 1,
			endHeight: 1,
			maxResults: 0,
		})).resolves.toEqual([])
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
