import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getRawTransaction,
	getTreeState,
} from '$/sources/Zcashd/JsonRpc/queries.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import bindings from '$/sources/Zcashd/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { default: zcashdResolvers } = await import('$/resolvers/Zcashd-JsonRpc.ts')

const zcashdMainnetBinding = bindings[Source.Zcashd_JsonRpc]

const fetchMock = vi.fn<typeof fetch>()

const rpcResponse = (result: unknown) => new Response(JSON.stringify({
	jsonrpc: '2.0',
	id: 1,
	result,
}), {
	headers: {
		'content-type': 'application/json',
	},
})

describe('Zcashd JSON-RPC queries', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', fetchMock)
		fetchMock.mockReset()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('requests and preserves exact-block Sapling and Orchard commitment trees', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse({
			hash: '0000000000000000000000000000000000000000000000000000000000000123',
			height: 2_800_000,
			time: 1_750_000_000,
			sapling: {
				skipHash: 'sapling-skip',
				commitments: {
					finalRoot: 'sapling-root',
					finalState: 'sapling-state',
				},
			},
			orchard: {
				skipHash: 'orchard-skip',
				commitments: {
					finalRoot: 'orchard-root',
					finalState: 'orchard-state',
				},
			},
		}))

		await expect(getTreeState({
			binding: zcashdMainnetBinding,
			block: 2_800_000,
		})).resolves.toMatchObject({
			height: 2_800_000,
			sapling: {
				commitments: {
					finalRoot: 'sapling-root',
					finalState: 'sapling-state',
				},
			},
			orchard: {
				commitments: {
					finalRoot: 'orchard-root',
					finalState: 'orchard-state',
				},
			},
		})
		expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'z_gettreestate',
			params: [2_800_000],
		})
	})

	it('accepts the Zcash transaction wire without Bitcoin weight', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse({
			txid: 'transaction-id',
			hash: 'transaction-hash',
			version: 5,
			overwintered: true,
			versiongroupid: '26a7270a',
			locktime: 0,
			expiryheight: 2_800_040,
			size: 1_024,
			vin: [],
			vout: [],
			vShieldedSpend: [{
				cv: 'value-commitment',
				anchor: 'anchor',
				nullifier: 'nullifier',
				rk: 'randomized-key',
				proof: 'spend-proof',
				spendAuthSig: 'spend-auth-signature',
			}],
			vShieldedOutput: [],
		}))

		await expect(getRawTransaction({
			binding: zcashdMainnetBinding,
			txId: 'transaction-id',
		})).resolves.toMatchObject({
			expiryheight: 2_800_040,
			vShieldedSpend: [{
				proof: 'spend-proof',
			}],
		})
		expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'getrawtransaction',
			params: [
				'transaction-id',
				1,
			],
		})
	})

	it('rejects invalid pool/action identities before provider lookup', async () => {
			const resolver = zcashdResolvers.resolvers.find((candidate) => (
				candidate.entityType === EntityType.ZcashShieldedAction
			))
			const actionResolver = resolver.resolve[
				'TransactionPoolActionKindIndexInTransaction'
			]

			await expect(actionResolver.resolve({
				$transaction: {
					$network: {
					slug: networkBySlug.zcash.slug,
				},
				txId: 'transaction-id',
			},
				pool: ZcashShieldedPoolKind.Sprout,
				actionKind: ZcashShieldedActionKind.Action,
				indexInTransaction: 0,
			})).rejects.toThrow('invalid sprout/action shielded action')
			expect(fetchMock).not.toHaveBeenCalled()
		})

	it('rejects tree state returned for a different selected block', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse({
			hash: 'different-block-hash',
			height: 2_800_001,
			time: 1_750_000_000,
		}))
			const resolver = zcashdResolvers.resolvers.find((candidate) => (
				candidate.entityType === EntityType.ZcashShieldedPoolBlockState
			))
			const treeStateResolver = resolver.resolve[
				'BlockPool'
			]

			await expect(treeStateResolver.resolve({
				$block: {
				$network: {
					slug: networkBySlug.zcash.slug,
				},
				height: 2_800_000n,
				hash: 'selected-block-hash',
			},
			$pool: {
				$network: {
					slug: networkBySlug.zcash.slug,
				},
					pool: ZcashShieldedPoolKind.Sapling,
				},
			})).rejects.toThrow('returned a different block')
		})
})
