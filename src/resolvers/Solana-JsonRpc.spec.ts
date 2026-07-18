import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'

vi.mock('$/sources/Solana/JsonRpc/queries.ts', () => ({
	solanaMainnetRpcEndpoints: [{
		url: 'https://solana.example',
		transportType: 'Http',
		providerName: 'Solana Labs',
	}],
	getSlot: vi.fn().mockResolvedValue(100),
	getBlocks: vi.fn().mockResolvedValue([100]),
	getBlock: vi.fn().mockResolvedValue({
		blockhash: 'block-hash',
		parentSlot: 99,
		previousBlockhash: 'parent-hash',
		transactions: [{
			transaction: {
				signatures: ['signature'],
				message: {
					accountKeys: [
						{
							pubkey: 'account-1',
							signer: true,
							writable: true,
						},
					],
					instructions: [
						{
							program: 'spl-token',
							programId: 'token-program',
							parsed: {
								type: 'transferChecked',
								info: {
									source: 'token-account-source',
									destination: 'token-account-destination',
									mint: 'token-mint',
								},
							},
						},
						{
							programId: 'application-program',
						},
					],
				},
			},
			meta: {
				err: null,
				fee: 5000,
				innerInstructions: [{
					index: 0,
					instructions: [{
						program: 'spl-associated-token-account',
						programId: 'associated-token-program',
						parsed: {
							type: 'create',
							info: {
								account: 'token-account-created',
								mint: 'token-mint',
							},
						},
					}],
				}],
			},
		}],
	}),
}))

const { default: solanaJsonRpc } = await import('$/resolvers/Solana-JsonRpc.ts')
const {
	getBlock,
	getBlocks,
} = await import('$/sources/Solana/JsonRpc/queries.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const networkSelector = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
}

describe('Solana JSON-RPC network state lists', () => {
	it('owns the registered Solana RPC endpoints', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& 'rpcEndpoints' in candidate.projections.Solana
		))
		if (resolver == null) throw new Error('Solana RPC endpoint resolver is missing')

		const rpcEndpoints = await resolver.resolve[NetworkSelector.Caip2].resolve(
			networkSelector,
			context
		)

		expect(resolver.projections.Solana.rpcEndpoints(rpcEndpoints)).toEqual([{
			url: 'https://solana.example',
			transportType: 'Http',
			providerName: 'Solana Labs',
		}])
	})

	it('derives every recent state list from one partial-failure-tolerant block scan', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& '$$programs' in candidate.projections.Solana
		))
		if (resolver == null) throw new Error('Solana network state resolver is missing')

		vi.mocked(getBlocks).mockResolvedValueOnce([99, 100])
		vi.mocked(getBlock).mockRejectedValueOnce(new Error('pruned slot'))
		const state = await resolver.resolve[NetworkSelector.Caip2].resolve(
			networkSelector,
			context
		)

		expect(getBlock).toHaveBeenCalledTimes(2)
		expect(resolver.projections.Solana.$$transactions(state)).toHaveLength(1)
		expect(resolver.projections.Solana.$$accounts(state)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				pubkey: 'account-1',
			},
		}])
		expect(resolver.projections.Solana.$$programs(state)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					programId: 'token-program',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					programId: 'application-program',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					programId: 'associated-token-program',
				},
			},
		])
		expect(resolver.projections.Solana.$$tokenAccounts(state)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					tokenAccountPubkey: 'token-account-destination',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					tokenAccountPubkey: 'token-account-source',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					tokenAccountPubkey: 'token-account-created',
				},
			},
		])
		expect(resolver.projections.Solana.$$tokenMints(state)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				mintAddress: 'token-mint',
			},
		}])
	})
})
