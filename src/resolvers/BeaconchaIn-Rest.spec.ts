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
const getSlotAttestations = vi.hoisted(() => vi.fn())
const getSlotWithdrawals = vi.hoisted(() => vi.fn())
const getSlotAttesterSlashings = vi.hoisted(() => vi.fn())
const getSlotProposerSlashings = vi.hoisted(() => vi.fn())
const getValidator = vi.hoisted(() => vi.fn())

vi.mock('$/sources/BeaconchaIn/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/BeaconchaIn/Rest/queries.ts')>(),
	getEpoch,
	getEpochSlots,
	getSlot,
	getSlotAttestations,
	getSlotWithdrawals,
	getSlotAttesterSlashings,
	getSlotProposerSlashings,
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
	pagination: {
		limit: 16,
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
	&& 'canonical' in resolver.projections
))
const slotAttestationsResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$beaconAttestations' in resolver.projections
))
const slotWithdrawalsResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$beaconWithdrawals' in resolver.projections
))
const slotSlashingsResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$beaconSlashings' in resolver.projections
))
const attestationResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconAttestation
))
const withdrawalResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconWithdrawal
))
const slashingResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlashing
))
const validatorResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator
))

if (
	epochResolver == null
	|| epochSlotsResolver == null
	|| slotResolver == null
	|| slotAttestationsResolver == null
	|| slotWithdrawalsResolver == null
	|| slotSlashingsResolver == null
	|| attestationResolver == null
	|| withdrawalResolver == null
	|| slashingResolver == null
	|| validatorResolver == null
)
	throw new Error('BeaconchaIn resolver facets missing')

describe('BeaconchaIn-Rest resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getEpoch.mockReset()
		getEpochSlots.mockReset()
		getSlot.mockReset()
		getSlotAttestations.mockReset()
		getSlotWithdrawals.mockReset()
		getSlotAttesterSlashings.mockReset()
		getSlotProposerSlashings.mockReset()
		getValidator.mockReset()
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

	it('resolves validators by pubkey and hard-fails unbound networks', async () => {
		getValidator.mockResolvedValueOnce({
			validator_index: 9,
			pubkey: '0x' + 'bb'.repeat(48),
			balance: 31000000000,
			effective_balance: 32000000000,
			status: 'active_offline',
			slashed: true,
		})

		await expect(validatorResolver.resolve.NetworkPubkey.resolve({
			$network: network,
			pubkey: `0x${'bb'.repeat(48)}`,
		}, context)).resolves.toMatchObject({
			indexInNetwork: 9,
			pubkey: `0x${'bb'.repeat(48)}`,
			slashed: true,
			status: 'active_offline',
		})

		await expect(slotResolver.resolve.EvmNetworkSlot.resolve({
			$network: {
				caip2: {
					namespace: 'eip155' as const,
					reference: '999',
				},
			},
			slot: 1,
		}, context)).rejects.toThrow('no binding for chain 999')
	})

	it('projects empty epoch slots as [] without soft-failing', async () => {
		getEpochSlots.mockResolvedValueOnce([])

		await expect(epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 10,
		}, context)).resolves.toEqual([])
	})

	it('projects slot duties and hard-fails missing duty rows', async () => {
		getSlotAttestations
			.mockResolvedValueOnce([
				{
					aggregationbits: '0xff',
					block_index: 2,
					committeeindex: 4,
					slot: 319,
					block_slot: 320,
				},
			])
			.mockResolvedValueOnce([])
		getSlotWithdrawals
			.mockResolvedValueOnce([
				{
					address: '0x' + 'cc'.repeat(20),
					amount: 42,
					block_slot: 320,
					validatorindex: 7,
					withdrawalindex: 100,
				},
			])
			.mockResolvedValueOnce([])
		getSlotProposerSlashings.mockResolvedValueOnce([
			{ block_index: 0, block_slot: 320, proposerindex: 1 },
		])
		getSlotAttesterSlashings.mockResolvedValueOnce([])

		await expect(slotAttestationsResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 320,
					indexInSlot: 2,
				},
			},
		])

		await expect(slotWithdrawalsResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 320,
					indexInSlot: 0,
				},
			},
		])

		await expect(slotSlashingsResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 320,
					kind: 'proposer',
					indexInSlot: 0,
				},
			},
		])

		await expect(attestationResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 320,
			indexInSlot: 2,
		}, context)).rejects.toThrow('attestation not found')

		await expect(withdrawalResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 320,
			indexInSlot: 0,
		}, context)).rejects.toThrow('withdrawal not found')
	})

	it('maps withdrawal and attestation detail fields', async () => {
		getSlotWithdrawals.mockResolvedValueOnce([
			{
				address: '0x' + 'dd'.repeat(20),
				amount: 99,
				block_slot: 320,
				validatorindex: 8,
				withdrawalindex: 101,
			},
		])
		getSlotAttestations.mockResolvedValueOnce([
			{
				aggregationbits: 'ff',
				block_index: 1,
				committeeindex: 3,
				slot: 319,
				block_slot: 320,
			},
		])
		getSlotAttesterSlashings.mockResolvedValueOnce([
			{ block_index: 1, block_slot: 320 },
		])

		await expect(withdrawalResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 320,
			indexInSlot: 0,
		}, context)).resolves.toMatchObject({
			validatorIndex: 8,
			amountGwei: 99n,
		})

		await expect(attestationResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 320,
			indexInSlot: 1,
		}, context)).resolves.toEqual({
			committeeIndex: 3,
			aggregationBits: '0xff',
		})

		await expect(slashingResolver.resolve.EvmNetworkSlotKindIndexInSlot.resolve({
			$network: network,
			slot: 320,
			kind: 'attester',
			indexInSlot: 1,
		}, context)).resolves.toMatchObject({
			kind: 'attester',
			indexInSlot: 1,
			slot: 320,
		})
	})

	it('omits unsupported committee facets', () => {
		expect(
			beaconchaInRest.resolvers.some((resolver) => (
				resolver.entityType === EntityType.BeaconSlot
				&& '$$beaconCommittees' in resolver.projections
			))
		).toBe(false)
	})
})
