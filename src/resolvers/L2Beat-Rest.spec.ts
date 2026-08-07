import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const fetchScalingSummary = vi.hoisted(() => vi.fn())

vi.mock('$/sources/L2Beat/Rest/queries.ts', () => ({
	fetchScalingSummary,
}))

const { default: l2Beat } = await import('$/resolvers/L2Beat-Rest.ts')

const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const networkSelector = {
	caip2: {
		namespace: 'eip155' as const,
		reference: '42161',
	},
}

const arbitrumProject = {
	id: 'arbitrum',
	name: 'Arbitrum One',
	slug: 'arbitrum',
	type: 'layer2',
	category: 'Optimistic Rollup',
	hostChain: 'Ethereum',
	stage: 'Stage 1',
	isArchived: false,
	isUnderReview: false,
}

describe('L2Beat resolver', () => {
	it('keeps direct snapshots plain and relationship references compact', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				arbitrum: arbitrumProject,
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})

		expect((await l2Beat.resolvers[0].resolve.Caip2.resolve(networkSelector, emptyContext)).slug).toBe('arbitrum')

		const rollupResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmRollup
			&& '$$timestamps' in candidate.projections
		))
		if (rollupResolver == null)
			throw new Error('L2Beat_Rest: missing EvmRollup $$timestamps resolver')

		const rollup = await rollupResolver.resolve.EvmNetworkProjectId.resolve({
			$network: networkSelector,
			projectId: 'arbitrum',
		}, emptyContext)
		expect(rollup.name).toBe('Arbitrum One')
		expect(rollup.type).toBe('layer2')
		expect(rollup.category).toBe('Optimistic Rollup')
		expect(rollup.$settlementNetwork[EntityMetaKey.Selector].caip2.reference).toBe('1')
		expect(EntityMetaKey.Fields in rollup).toBe(false)
		expect(rollupResolver.projections.$$timestamps(rollup)).toEqual([{
			[EntityMetaKey.Selector]: {
				$rollup: {
					$network: networkSelector,
					projectId: 'arbitrum',
				},
				timestampMs: 1_785_830_400_000,
				source: Source.L2Beat_Rest,
			},
		}])

		const relationshipResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Evm' in candidate.projections
			&& '$rollup' in candidate.projections.Evm
		))
		if (relationshipResolver == null)
			throw new Error('L2Beat_Rest: missing Network Evm relationship resolver')
		expect((await relationshipResolver.resolve.Caip2.resolve(networkSelector, emptyContext)).rollup).toEqual({
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				projectId: 'arbitrum',
			},
		})
	})

	it('materializes listing-stage observations from the summary clock', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				arbitrum: arbitrumProject,
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})

		const timestampResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmRollup_Timestamp
		))
		if (timestampResolver == null)
			throw new Error('L2Beat_Rest: missing EvmRollup_Timestamp resolver')

		const observation = await timestampResolver.resolve.RollupTimestampMsSource.resolve({
			$rollup: {
				$network: networkSelector,
				projectId: 'arbitrum',
			},
			timestampMs: 1_785_830_400_000,
			source: Source.L2Beat_Rest,
		}, emptyContext)

		expect(observation).toEqual({
			isArchived: false,
			isUnderReview: false,
			listingStage: 'Stage 1',
		})
		expect(timestampResolver.projections.listingStage(observation)).toBe('Stage 1')
	})

	it('fails closed on unknown host chains and observation clock mismatch', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				'lighter-robinhood': {
					id: 'lighter-robinhood',
					name: 'Lighter on Robinhood',
					slug: 'lighter-robinhood',
					type: 'layer3',
					hostChain: 'Unknown Host',
					stage: 'Stage 0',
				},
				arbitrum: arbitrumProject,
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})

		const rollupResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmRollup
		))
		if (rollupResolver == null)
			throw new Error('L2Beat_Rest: missing EvmRollup resolver')

		await expect(rollupResolver.resolve.EvmNetworkProjectId.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '4663',
				},
			},
			projectId: 'lighter-robinhood',
		}, emptyContext)).rejects.toThrow('L2Beat_Rest: unknown host chain Unknown Host')

		const timestampResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmRollup_Timestamp
		))
		if (timestampResolver == null)
			throw new Error('L2Beat_Rest: missing EvmRollup_Timestamp resolver')

		await expect(timestampResolver.resolve.RollupTimestampMsSource.resolve({
			$rollup: {
				$network: networkSelector,
				projectId: 'arbitrum',
			},
			timestampMs: 1,
			source: Source.L2Beat_Rest,
		}, emptyContext)).rejects.toThrow('L2Beat_Rest: rollup observation clock mismatch')
	})

	it('settles Robinhood-hosted L3s onto Robinhood Chain', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				'lighter-robinhood': {
					id: 'lighter-robinhood',
					name: 'Lighter on Robinhood',
					slug: 'lighter-robinhood',
					type: 'layer3',
					hostChain: 'Robinhood Chain',
					stage: 'Stage 0',
					isArchived: false,
					isUnderReview: false,
				},
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})

		const rollupResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmRollup
		))
		if (rollupResolver == null)
			throw new Error('L2Beat_Rest: missing EvmRollup resolver')

		const rollup = await rollupResolver.resolve.EvmNetworkProjectId.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '4663',
				},
			},
			projectId: 'lighter-robinhood',
		}, emptyContext)

		expect(rollup.$settlementNetwork[EntityMetaKey.Selector].caip2.reference).toBe('4663')
		expect(rollup.hostChain).toBe('Robinhood Chain')
	})

	it('lists unmapped host-settled projects on $$settledRollups leftovers', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				arbitrum: arbitrumProject,
				'lighter-robinhood': {
					id: 'lighter-robinhood',
					name: 'Lighter on Robinhood',
					slug: 'lighter-robinhood',
					type: 'layer3',
					hostChain: 'Robinhood Chain',
					isArchived: false,
				},
				aevo: {
					id: 'aevo',
					name: 'Aevo',
					slug: 'aevo',
					type: 'layer2',
					hostChain: 'Ethereum',
					isArchived: false,
				},
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})

		const relationshipResolver = l2Beat.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Evm' in candidate.projections
			&& '$$settledRollups' in candidate.projections.Evm
		))
		if (relationshipResolver == null)
			throw new Error('L2Beat_Rest: missing Network Evm relationship resolver')

		const ethereum = await relationshipResolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, emptyContext)
		expect(ethereum.settledRollups).toEqual(expect.arrayContaining([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '42161',
						},
					},
					projectId: 'arbitrum',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					projectId: 'aevo',
				},
			},
		]))
		expect(
			ethereum.settledRollups.some((rollup) => (
				rollup[EntityMetaKey.Selector].projectId === 'lighter-robinhood'
			))
		).toBe(false)

		const robinhood = await relationshipResolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '4663',
			},
		}, emptyContext)
		expect(robinhood.settledRollups).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '4663',
						},
					},
					projectId: 'lighter-robinhood',
				},
			},
		])
		expect(robinhood.childLayers).toEqual([])
	})
})
