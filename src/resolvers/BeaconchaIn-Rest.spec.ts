import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { slotsPerEpoch } from '$/constants/BeaconConsensus.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getEpoch = vi.hoisted(() => vi.fn())
const getEpochSlots = vi.hoisted(() => vi.fn())
const getSlot = vi.hoisted(() => vi.fn())
const getValidator = vi.hoisted(() => vi.fn())

vi.mock('$/sources/BeaconchaIn/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/BeaconchaIn/Rest/queries.ts')>(),
	getEpoch,
	getEpochSlots,
	getSlot,
	getValidator,
}))

const { default: beaconchaInRest } = await import('$/resolvers/BeaconchaIn-Rest.ts')

const network = {
	caip2: {
		namespace: 'eip155' as const,
		reference: '1',
	},
}

const context = {
	publicEnv: {
		PUBLIC_BEACONCHAIN_API_KEY: 'test-api-key',
	},
}

const epochResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconEpoch
	&& 'finalized' in resolver.projections
))
const epochSlotsResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconEpoch
	&& '$$beaconSlots' in resolver.projections
))
const slotResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
))
const validatorResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator
))

if (
	epochResolver == null
	|| epochSlotsResolver == null
	|| slotResolver == null
	|| validatorResolver == null
)
	throw new Error('BeaconchaIn resolver facets missing')

describe('BeaconchaIn-Rest resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps epoch overview into schema fields', async () => {
		getEpoch.mockResolvedValueOnce({
			epoch: 10,
			finalized: true,
			globalparticipationrate: 0.98,
			validatorscount: 100,
			attestationscount: 50,
			attesterslashingscount: 1,
			proposerslashingscount: 2,
			withdrawalcount: 3,
		})

		const snapshot = await epochResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 10,
		}, context)

		expect(snapshot).toMatchObject({
			startSlot: 10 * slotsPerEpoch,
			endSlot: (10 * slotsPerEpoch) + slotsPerEpoch - 1,
			slotCount: slotsPerEpoch,
			finalized: true,
			globalParticipationRate: 0.98,
			validatorsCount: 100,
			attestationsCount: 50,
			attesterSlashingsCount: 1,
			proposerSlashingsCount: 2,
			withdrawalsCount: 3,
		})
		expect(beaconchaInRest.source).toBe(Source.BeaconchaIn_Rest)
	})

	it('projects epoch slots as BeaconSlot selectors', async () => {
		getEpochSlots.mockResolvedValueOnce([
			{ slot: 320 },
			{ slot: 321 },
		])

		await expect(epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 10,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 320,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 321,
				},
			},
		])
	})

	it('maps slot and validator wire into schema fields', async () => {
		getSlot.mockResolvedValueOnce({
			epoch: 10,
			proposer: 7,
			blockroot: '11'.repeat(32),
			parentroot: '22'.repeat(32),
			stateroot: '33'.repeat(32),
			signature: '44'.repeat(96),
			status: '1',
		})
		getValidator.mockResolvedValueOnce({
			validator_index: 7,
			pubkey: '0x' + 'aa'.repeat(48),
			balance: 32000000000,
			effective_balance: 32000000000,
			status: 'active_online',
			slashed: false,
		})

		await expect(slotResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)).resolves.toMatchObject({
			epoch: 10,
			proposerIndex: 7,
			canonical: true,
			root: `0x${'11'.repeat(32)}`,
		})

		await expect(validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 7,
		}, context)).resolves.toMatchObject({
			indexInNetwork: 7,
			balanceGwei: 32000000000n,
			effectiveBalanceGwei: 32000000000n,
			status: 'active_online',
			slashed: false,
		})
	})
})
