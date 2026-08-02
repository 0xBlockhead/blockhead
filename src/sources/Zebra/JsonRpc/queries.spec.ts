import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Zebra/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlock,
	getRawTransaction,
	getTransparentAddressTransactionIds,
	getTransparentAddressUtxos,
} = await import('$/sources/Zebra/JsonRpc/queries.ts')

const binding = bindings[Source.Zebra_JsonRpc][0]

const address = `t1${'A'.repeat(33)}`

describe('Zebra transparent-address transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the exact canonical Zcash mainnet binding', () => {
		expect(binding).toEqual({
			source: Source.Zebra_JsonRpc,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'bip122:00040fe8ec8471911baa1db1266ea15',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:8232',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.BitcoinJsonRpc,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.LocalOnly,
			credentials: [{
				scope: SourceCredentialScope.LocalSecret,
			}],
		})
	})

	it('threads the selected binding through neutral JSON-RPC block and transaction reads', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				hash: 'a'.repeat(64),
			})
			.mockResolvedValueOnce({
				txid: 'b'.repeat(64),
			})

		await getBlock({
			binding,
			blockHash: 'a'.repeat(64),
		})
		await getRawTransaction({
			binding,
			txId: 'b'.repeat(64),
		})

		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'getblock',
				[
					'a'.repeat(64),
					2,
				],
			],
			[
				binding,
				'getrawtransaction',
				[
					'b'.repeat(64),
					true,
				],
			],
		])
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

		await expect(getTransparentAddressUtxos({
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

		await expect(getTransparentAddressTransactionIds({
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
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('foreign address row')

		jsonRpc2.mockResolvedValueOnce([
			'c'.repeat(64),
			'c'.repeat(64),
		])
		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 2,
			maxResults: 2,
		})).rejects.toThrow('duplicate transparent transaction ID')

		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 10_001,
			maxResults: 1,
		})).rejects.toThrow('1 through 10000 blocks')
		expect(jsonRpc2).toHaveBeenCalledTimes(2)
	})

	it('does not transport zero-cardinality requests', async () => {
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 0,
		})).resolves.toMatchObject({
			utxos: [],
		})
		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 1,
			maxResults: 0,
		})).resolves.toEqual([])
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
