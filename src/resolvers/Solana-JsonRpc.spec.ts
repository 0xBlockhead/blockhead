import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'

vi.mock('$/sources/Solana/JsonRpc/queries.ts', () => ({
	getSlot: vi.fn().mockResolvedValue(100),
	getVoteAccounts: vi.fn().mockResolvedValue({
		current: [{
			activatedStake: 1_000,
			commission: 5,
			epochCredits: [[1, 2, 3]],
			lastVote: 99,
			nodePubkey: 'node-current',
			rootSlot: 98,
			votePubkey: 'vote-current',
		}],
		delinquent: [],
	}),
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

		expect(resolver.projections.Solana.rpcEndpoints(rpcEndpoints)).toEqual([
			{
				url: 'https://solana-rpc.publicnode.com',
				transportType: 'Http',
				providerName: 'PublicNode',
			},
			{
				url: 'wss://solana-rpc.publicnode.com',
				transportType: 'WebSocket',
				providerName: 'PublicNode',
			},
		])
	})

	it('fails the shared recent-state snapshot when any requested block fails', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& '$$programs' in candidate.projections.Solana
		))
		if (resolver == null) throw new Error('Solana network state resolver is missing')

		vi.mocked(getBlocks).mockResolvedValueOnce([99, 100])
		vi.mocked(getBlock).mockRejectedValueOnce(new Error('pruned slot'))
		await expect(resolver.resolve[NetworkSelector.Caip2].resolve(
			networkSelector,
			context
		)).rejects.toThrow('pruned slot')

		expect(getBlock).toHaveBeenCalledTimes(2)
	})

	it('embeds validator observations exclusively through canonical field addresses', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& '$$validators' in candidate.projections.Solana
			&& typeof candidate.projections.Solana.$$validators === 'function'
		))
		if (resolver == null) throw new Error('Solana validator resolver is missing')

		const validators = resolver.projections.Solana.$$validators(
			await resolver.resolve[NetworkSelector.Caip2].resolve(networkSelector, context)
		)
		expect(validators).toHaveLength(1)
		expect(Object.keys(validators[0])).toEqual([
			EntityMetaKey.Selector,
			EntityMetaKey.Fields,
		])
		expect(validators[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')]: [expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'nodePubkey')]: 'node-current',
					[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'activatedStakeLamports')]: 1_000n,
				}),
			})],
		})
		expect(Object.keys(validators[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')
		][0])).toEqual([
			EntityMetaKey.Selector,
			EntityMetaKey.Fields,
		])
	})
})
