import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { slotsPerEpoch } from '$/constants/BeaconConsensus.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getEpoch = vi.hoisted(() => vi.fn())
const getEpochSlots = vi.hoisted(() => vi.fn())
const getSlot = vi.hoisted(() => vi.fn())
const getSlotAttestations = vi.hoisted(() => vi.fn())
const getSlotAttesterSlashings = vi.hoisted(() => vi.fn())
const getSlotDeposits = vi.hoisted(() => vi.fn())
const getSlotProposerSlashings = vi.hoisted(() => vi.fn())
const getSlotWithdrawals = vi.hoisted(() => vi.fn())
const getValidator = vi.hoisted(() => vi.fn())
const getValidatorAttestations = vi.hoisted(() => vi.fn())

vi.mock('$/sources/BeaconchaIn/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/BeaconchaIn/Rest/queries.ts')>(),
	getEpoch,
	getEpochSlots,
	getSlot,
	getSlotAttestations,
	getSlotAttesterSlashings,
	getSlotDeposits,
	getSlotProposerSlashings,
	getSlotWithdrawals,
	getValidator,
	getValidatorAttestations,
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
const validatorResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator
	&& 'indexInNetwork' in resolver.projections
))
const validatorTimestampResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator_Timestamp
))
const validatorAttestationDutiesResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator
	&& 'attestationDuties' in resolver.projections
))
const slotDutyResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$beaconAttestations' in resolver.projections
	&& '$$beaconDeposits' in resolver.projections
))
const blockDutyResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconBlock
	&& '$$attestations' in resolver.projections
	&& '$$deposits' in resolver.projections
))
const attestationResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconAttestation
))
const depositResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconDeposit
))
const withdrawalResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconWithdrawal
))
const slashingResolver = beaconchaInRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlashing
))

if (
	epochResolver == null
	|| epochSlotsResolver == null
	|| slotResolver == null
	|| validatorResolver == null
	|| validatorTimestampResolver == null
	|| validatorAttestationDutiesResolver == null
	|| slotDutyResolver == null
	|| blockDutyResolver == null
	|| attestationResolver == null
	|| depositResolver == null
	|| withdrawalResolver == null
	|| slashingResolver == null
)
	throw new Error('BeaconchaIn resolver facets missing')

describe('BeaconchaIn-Rest resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getEpoch.mockReset()
		getEpochSlots.mockReset()
		getSlot.mockReset()
		getSlotAttestations.mockReset()
		getSlotAttesterSlashings.mockReset()
		getSlotDeposits.mockReset()
		getSlotProposerSlashings.mockReset()
		getSlotWithdrawals.mockReset()
		getValidator.mockReset()
		getValidatorAttestations.mockReset()
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

	it('projects epoch slots with enrolled fields and authoritative resolveCount', async () => {
		getEpochSlots.mockResolvedValueOnce([
			{
				slot: 320,
				epoch: 10,
				blockroot: '11'.repeat(32),
				parentroot: '22'.repeat(32),
				stateroot: '33'.repeat(32),
				signature: '44'.repeat(96),
				proposer: 7,
				status: '1',
			},
			{
				slot: 321,
				epoch: 10,
				blockroot: '55'.repeat(32),
				parentroot: '66'.repeat(32),
				stateroot: '77'.repeat(32),
				signature: '88'.repeat(96),
				proposer: 8,
				status: '2',
			},
		])

		const snapshot = await epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 10,
		}, context)
		expect(epochSlotsResolver.projections.$$beaconSlots.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 320,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 10,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: 7,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: `0x${'11'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: `0x${'22'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: `0x${'33'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: `0x${'44'.repeat(96)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: true,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 321,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 10,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: 8,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: `0x${'55'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: `0x${'66'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: `0x${'77'.repeat(32)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: `0x${'88'.repeat(96)}`,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: false,
				},
			},
		])
		expect(epochSlotsResolver.projections.$$beaconSlots.resolveCount(snapshot)).toBe(2)
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
			last_attestation_slot: 319,
			activation_epoch: 0,
			withdrawal_credentials: '00' + 'dd'.repeat(31),
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

		const validator = await validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 7,
		}, context)
		expect(validator).toMatchObject({
			indexInNetwork: 7,
			balanceGwei: 32000000000n,
			effectiveBalanceGwei: 32000000000n,
			status: 'active_online',
			slashed: false,
		})
		expect(validatorResolver.projections.$$timestamps(validator)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$validator: {
						$network: network,
						indexInNetwork: 7,
					},
					slot: 319,
					source: Source.BeaconchaIn_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'status')]: 'active_online',
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'slashed')]: false,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'activationEpoch')]: 0,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'withdrawalCredentials')]: `0x${'00'}${'dd'.repeat(31)}`,
				}),
			},
		])
	})

	it('resolves validators by pubkey and hard-fails unbound networks', async () => {
		getValidator.mockResolvedValueOnce({
			validator_index: 9,
			pubkey: '0x' + 'bb'.repeat(48),
			balance: 31000000000,
			effective_balance: 32000000000,
			status: 'active_offline',
			slashed: true,
			last_attestation_slot: 400,
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

	it('projects tip BeaconValidator_Timestamp and rejects foreign observation slots', async () => {
		getValidator
			.mockResolvedValueOnce({
				validator_index: 7,
				pubkey: '0x' + 'aa'.repeat(48),
				balance: 32000000000,
				effective_balance: 32000000000,
				status: 'active_online',
				slashed: false,
				last_attestation_slot: 319,
				activation_eligibility_epoch: 0,
				activation_epoch: 1,
				exit_epoch: 18446744073709551615,
				withdrawable_epoch: 18446744073709551615,
			})
			.mockResolvedValueOnce({
				validator_index: 7,
				pubkey: '0x' + 'aa'.repeat(48),
				balance: 32000000000,
				effective_balance: 32000000000,
				status: 'active_online',
				slashed: false,
				last_attestation_slot: 319,
			})

		await expect(validatorTimestampResolver.resolve.ValidatorSlotSource.resolve({
			$validator: {
				$network: network,
				indexInNetwork: 7,
			},
			slot: 319,
			source: Source.BeaconchaIn_Rest,
		}, context)).resolves.toMatchObject({
			slot: 319,
			source: Source.BeaconchaIn_Rest,
			balanceGwei: 32000000000n,
			activationEpoch: 1,
			status: 'active_online',
		})

		await expect(validatorTimestampResolver.resolve.ValidatorSlotSource.resolve({
			$validator: {
				$network: network,
				indexInNetwork: 7,
			},
			slot: 1,
			source: Source.BeaconchaIn_Rest,
		}, context)).rejects.toThrow('no validator observation at slot 1')
	})

	it('falls back to latest slot when last_attestation_slot is absent', async () => {
		getValidator.mockResolvedValueOnce({
			validator_index: 3,
			pubkey: '0x' + 'cc'.repeat(48),
			balance: 1,
			effective_balance: 1,
			status: 'pending_initialized',
			slashed: false,
		})
		getSlot.mockResolvedValueOnce({
			slot: 9600000,
			epoch: 300000,
			blockroot: '11'.repeat(32),
			parentroot: '22'.repeat(32),
			stateroot: '33'.repeat(32),
			signature: '44'.repeat(96),
			proposer: 1,
			status: '1',
		})

		const validator = await validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 3,
		}, context)
		expect(validatorResolver.projections.$$timestamps(validator)[0][EntityMetaKey.Selector].slot).toBe(9600000)
		expect(getSlot).toHaveBeenCalledWith(context.publicEnv, {
			chainId: 1,
			slot: 'latest',
		})
	})

	it('projects empty epoch slots as [] without soft-failing', async () => {
		getEpochSlots.mockResolvedValueOnce([])

		const snapshot = await epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 10,
		}, context)
		expect(epochSlotsResolver.projections.$$beaconSlots.select(snapshot)).toEqual([])
		expect(epochSlotsResolver.projections.$$beaconSlots.resolveCount(snapshot)).toBe(0)
	})

	it('maps validator attestation duties and hard-fails HTTP errors', async () => {
		getValidatorAttestations
			.mockResolvedValueOnce([
				{
					attesterslot: 12779525,
					epoch: 399360,
					inclusionslot: 12779526,
					status: 1,
					validatorindex: 20,
					committeeindex: 0,
				},
				{
					attesterslot: 12779557,
					epoch: 399361,
					inclusionslot: 0,
					status: 0,
					validatorindex: 20,
				},
			])
			.mockResolvedValueOnce([])
			.mockRejectedValueOnce(new Error('BeaconchaIn GET validator attestations failed: 500'))

		const duties = await validatorAttestationDutiesResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 20,
		}, context)
		expect(validatorAttestationDutiesResolver.projections.attestationDuties.select(duties)).toEqual([
			{
				attesterSlot: 12779525,
				epoch: 399360,
				inclusionSlot: 12779526,
				status: 1,
				committeeIndex: 0,
			},
			{
				attesterSlot: 12779557,
				epoch: 399361,
				inclusionSlot: 0,
				status: 0,
			},
		])
		expect(validatorAttestationDutiesResolver.projections.attestationDuties.resolveCount(duties)).toBe(2)

		const emptyDuties = await validatorAttestationDutiesResolver.resolve.NetworkPubkey.resolve({
			$network: network,
			pubkey: `0x${'aa'.repeat(48)}`,
		}, context)
		expect(validatorAttestationDutiesResolver.projections.attestationDuties.select(emptyDuties)).toEqual([])
		expect(validatorAttestationDutiesResolver.projections.attestationDuties.resolveCount(emptyDuties)).toBe(0)

		await expect(validatorAttestationDutiesResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 20,
		}, context)).rejects.toThrow('validator attestations failed')

		expect(
			'resolveLive' in validatorAttestationDutiesResolver.projections.attestationDuties
		).toBe(false)
	})

	it('lists Network tip beacon epochs and slots from latest head', async () => {
		const networkEpochsResolver = beaconchaInRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& typeof resolver.projections.Evm.$$beaconEpochs === 'object'
			&& 'select' in resolver.projections.Evm.$$beaconEpochs
		))
		const networkEpochsCountResolver = beaconchaInRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& typeof resolver.projections.Evm.$$beaconEpochs === 'object'
			&& 'resolveCount' in resolver.projections.Evm.$$beaconEpochs
		))
		const networkSlotsResolver = beaconchaInRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& typeof resolver.projections.Evm.$$beaconSlots === 'object'
			&& 'select' in resolver.projections.Evm.$$beaconSlots
		))
		const networkSlotsCountResolver = beaconchaInRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& typeof resolver.projections.Evm.$$beaconSlots === 'object'
			&& 'resolveCount' in resolver.projections.Evm.$$beaconSlots
		))
		if (
			networkEpochsResolver == null
			|| networkEpochsCountResolver == null
			|| networkSlotsResolver == null
			|| networkSlotsCountResolver == null
		)
			throw new Error('BeaconchaIn network tip facets missing')

		getEpoch.mockResolvedValueOnce({
			epoch: 12,
			finalized: true,
			globalparticipationrate: 0.9,
			validatorscount: 1,
			attestationscount: 1,
			attesterslashingscount: 0,
			proposerslashingscount: 0,
			withdrawalcount: 0,
		})
		getSlot.mockResolvedValueOnce({
			slot: 400,
			epoch: 12,
			blockroot: '11'.repeat(32),
			parentroot: '22'.repeat(32),
			stateroot: '33'.repeat(32),
			signature: '44'.repeat(96),
			proposer: 1,
			status: '1',
		})

		const tipContext = {
			...context,
			pagination: {
				limit: 3,
			},
		}
		const epochsPage = await networkEpochsResolver.resolve.Caip2.resolve(network, tipContext)
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.select(epochsPage)).toEqual([
			{
				[EntityMetaKey.Selector]: { $network: network, epoch: 12 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'startSlot')]: 12 * slotsPerEpoch,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'endSlot')]: (12 * slotsPerEpoch) + slotsPerEpoch - 1,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'slotCount')]: slotsPerEpoch,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'finalized')]: true,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'globalParticipationRate')]: 0.9,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'validatorsCount')]: 1,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'attestationsCount')]: 1,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'attesterSlashingsCount')]: 0,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'proposerSlashingsCount')]: 0,
					[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'withdrawalsCount')]: 0,
				},
			},
			{ [EntityMetaKey.Selector]: { $network: network, epoch: 11 } },
			{ [EntityMetaKey.Selector]: { $network: network, epoch: 10 } },
		])
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.continuation(epochsPage).token).toBe('9')

		const slotsPage = await networkSlotsResolver.resolve.Caip2.resolve(network, tipContext)
		expect(networkSlotsResolver.projections.Evm.$$beaconSlots.select(slotsPage)).toEqual([
			{
				[EntityMetaKey.Selector]: { $network: network, slot: 400 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 12,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: 1,
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: with0xHex('11'.repeat(32)),
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: with0xHex('22'.repeat(32)),
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: with0xHex('33'.repeat(32)),
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: with0xHex('44'.repeat(96)),
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: true,
				},
			},
			{ [EntityMetaKey.Selector]: { $network: network, slot: 399 } },
			{ [EntityMetaKey.Selector]: { $network: network, slot: 398 } },
		])
		expect(networkSlotsResolver.projections.Evm.$$beaconSlots.continuation(slotsPage).token).toBe('397')

		getEpoch.mockResolvedValueOnce({
			epoch: 12,
			finalized: true,
			globalparticipationrate: 0.9,
			validatorscount: 1,
			attestationscount: 1,
			attesterslashingscount: 0,
			proposerslashingscount: 0,
			withdrawalcount: 0,
		})
		const continuedEpochsPage = await networkEpochsResolver.resolve.Caip2.resolve(network, {
			...tipContext,
			pagination: {
				limit: 2,
			},
			providerContinuationToken: '9',
		})
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.select(continuedEpochsPage).map((epoch) => (
			epoch[EntityMetaKey.Selector].epoch
		))).toEqual([
			9,
			8,
		])
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.continuation(continuedEpochsPage).token).toBe('7')

		getSlot.mockResolvedValueOnce({
			slot: 400,
			epoch: 12,
			blockroot: '11'.repeat(32),
			parentroot: '22'.repeat(32),
			stateroot: '33'.repeat(32),
			signature: '44'.repeat(96),
			proposer: 1,
			status: '1',
		})
		const terminalSlotsPage = await networkSlotsResolver.resolve.Caip2.resolve(network, {
			...tipContext,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '0',
		})
		expect(networkSlotsResolver.projections.Evm.$$beaconSlots.continuation(terminalSlotsPage)).toEqual({
			operation: 'network-beacon-slots',
			terminal: true,
		})

		getEpoch.mockResolvedValueOnce({
			epoch: 12,
			finalized: true,
			globalparticipationrate: 0.9,
			validatorscount: 1,
			attestationscount: 1,
			attesterslashingscount: 0,
			proposerslashingscount: 0,
			withdrawalcount: 0,
		})
		await expect(networkEpochsResolver.resolve.Caip2.resolve(network, {
			...tipContext,
			providerContinuationToken: 'bad-token',
		})).rejects.toThrow('invalid epochs continuation')

		getEpoch.mockResolvedValueOnce({
			epoch: 12,
			finalized: true,
			globalparticipationrate: 0.9,
			validatorscount: 1,
			attestationscount: 1,
			attesterslashingscount: 0,
			proposerslashingscount: 0,
			withdrawalcount: 0,
		})
		await expect(networkEpochsResolver.resolve.Caip2.resolve(network, {
			...tipContext,
			providerContinuationToken: '13',
		})).rejects.toThrow('epochs continuation exceeds latest epoch')

		getEpoch.mockResolvedValueOnce({
			epoch: 12,
			finalized: true,
			globalparticipationrate: 0.9,
			validatorscount: 1,
			attestationscount: 1,
			attesterslashingscount: 0,
			proposerslashingscount: 0,
			withdrawalcount: 0,
		})
		await expect(networkEpochsCountResolver.resolve.Caip2.resolve(network, tipContext)).resolves.toBe(13)
		expect(networkEpochsCountResolver.projections.Evm.$$beaconEpochs.resolveCount(13)).toBe(13)

		getSlot.mockResolvedValueOnce({
			slot: 400,
			epoch: 12,
			blockroot: '11'.repeat(32),
			parentroot: '22'.repeat(32),
			stateroot: '33'.repeat(32),
			signature: '44'.repeat(96),
			proposer: 1,
			status: '1',
		})
		await expect(networkSlotsCountResolver.resolve.Caip2.resolve(network, tipContext)).resolves.toBe(401)
		expect(networkSlotsCountResolver.projections.Evm.$$beaconSlots.resolveCount(401)).toBe(401)
	})

	it('keys slot and block body occurrences by the provider block root', async () => {
		const root = with0xHex(`0x${'11'.repeat(32)}`)
		const $block = {
			$network: network,
			root,
		}
		getSlot.mockResolvedValue({
			slot: 320,
			epoch: 10,
			blockroot: root,
			parentroot: `0x${'22'.repeat(32)}`,
			stateroot: `0x${'33'.repeat(32)}`,
			signature: `0x${'44'.repeat(96)}`,
			proposer: 7,
			status: '1',
		})
		getSlotAttestations.mockResolvedValue([
			{
				aggregationbits: '0xff',
				block_index: 2,
				committeeindex: 4,
				slot: 319,
				block_slot: 320,
				block_root: root,
			},
		])
		getSlotDeposits.mockResolvedValue([
			{
				amount: 32_000_000_000,
				block_index: 0,
				block_slot: 320,
				publickey: `0x${'aa'.repeat(48)}`,
				signature: `0x${'bb'.repeat(96)}`,
				withdrawalcredentials: `0x${'cc'.repeat(32)}`,
				block_root: root,
				proof: `0x${'11'.repeat(32)}${'22'.repeat(32)}`,
			},
		])
		getSlotWithdrawals.mockResolvedValue([
			{
				address: `0x${'dd'.repeat(20)}`,
				amount: 1,
				block_slot: 320,
				validatorindex: 12,
				withdrawalindex: 100,
			},
		])
		getSlotProposerSlashings.mockResolvedValue([
			{
				block_index: 0,
				block_slot: 320,
				proposerindex: 9,
			},
		])
		getSlotAttesterSlashings.mockResolvedValue([])

		const slotDuties = await slotDutyResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)
		expect(slotDutyResolver.projections.$$beaconAttestations.select(slotDuties)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$block,
					indexInBlock: 2,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'committeeIndex')]: 4,
					[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'aggregationBits')]: '0xff',
				},
			},
		])
		expect(slotDutyResolver.projections.$$beaconDeposits.select(slotDuties)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$block,
				indexInBlock: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'pubkey')]: `0x${'aa'.repeat(48)}`,
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'amountGwei')]: 32_000_000_000n,
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'proof')]: [
					`0x${'11'.repeat(32)}`,
					`0x${'22'.repeat(32)}`,
				],
			},
		})
		expect(slotDutyResolver.projections.$$beaconWithdrawals.select(slotDuties)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block,
				withdrawalIndex: 100,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'indexInBlock')]: 0,
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: 1n,
			},
		}])
		expect(slotDutyResolver.projections.$$beaconSlashings.select(slotDuties)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$block,
					kind: 'proposer',
					indexInKind: 0,
				},
			},
		])
		expect(slotDutyResolver.projections.$$beaconAttestations.resolveCount(slotDuties)).toBe(1)
		expect(slotDutyResolver.projections.$$beaconDeposits.resolveCount(slotDuties)).toBe(1)

		const blockDuties = await blockDutyResolver.resolve.NetworkRoot.resolve({
			$network: network,
			root,
		}, context)
		expect(getSlot).toHaveBeenCalledWith(context.publicEnv, {
			chainId: 1,
			slot: root,
		})
		expect(blockDutyResolver.projections.$$attestations.select(blockDuties)[0][EntityMetaKey.Selector]).toEqual({
			$block,
			indexInBlock: 2,
		})
		expect(blockDutyResolver.projections.$$deposits.resolveCount(blockDuties)).toBe(1)
	})

	it('resolves fork-root attestation and deposit cards and rejects mismatched roots', async () => {
		const root = with0xHex(`0x${'11'.repeat(32)}`)
		getSlot.mockResolvedValue({
			slot: 320,
			epoch: 10,
			blockroot: root,
			parentroot: `0x${'22'.repeat(32)}`,
			stateroot: `0x${'33'.repeat(32)}`,
			signature: `0x${'44'.repeat(96)}`,
			proposer: 7,
			status: '1',
		})
		getSlotAttestations.mockResolvedValue([
			{
				aggregationbits: '03',
				block_index: 2,
				committeeindex: 4,
				slot: 319,
				block_slot: 320,
				block_root: root,
			},
		])
		getSlotDeposits.mockResolvedValue([
			{
				amount: 32_000_000_000,
				block_index: 0,
				block_slot: 320,
				publickey: `${'aa'.repeat(48)}`,
				signature: `${'bb'.repeat(96)}`,
				withdrawalcredentials: `${'cc'.repeat(32)}`,
				proof: null,
			},
		])

		const attestation = await attestationResolver.resolve.BlockIndexInBlock.resolve({
			$block: {
				$network: network,
				root,
			},
			indexInBlock: 2,
		}, context)
		expect(attestationResolver.projections.committeeIndex(attestation)).toBe(4)
		expect(attestationResolver.projections.aggregationBits(attestation)).toBe('0x03')

		const deposit = await depositResolver.resolve.BlockIndexInBlock.resolve({
			$block: {
				$network: network,
				root,
			},
			indexInBlock: 0,
		}, context)
		expect(depositResolver.projections.amountGwei(deposit)).toBe(32_000_000_000n)
		expect(depositResolver.projections.proof(deposit)).toEqual([])
		expect(depositResolver.projections.$validator(deposit)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				pubkey: `0x${'aa'.repeat(48)}`,
			},
		})

		getSlotAttestations.mockResolvedValueOnce([
			{
				aggregationbits: '0xff',
				block_index: 2,
				committeeindex: 4,
				slot: 319,
				block_slot: 320,
				block_root: `0x${'99'.repeat(32)}`,
			},
		])
		await expect(attestationResolver.resolve.BlockIndexInBlock.resolve({
			$block: {
				$network: network,
				root,
			},
			indexInBlock: 2,
		}, context)).rejects.toThrow('block root does not match the selected block')
	})

	it('resolves withdrawals and slashings from the slot owned by a block root', async () => {
		const root = with0xHex(`0x${'11'.repeat(32)}`)
		getSlot.mockResolvedValue({
			slot: 320,
			epoch: 10,
			blockroot: root,
			parentroot: `0x${'22'.repeat(32)}`,
			stateroot: `0x${'33'.repeat(32)}`,
			signature: `0x${'44'.repeat(96)}`,
			proposer: 7,
			status: '1',
		})
		getSlotWithdrawals.mockResolvedValue([
			{
				address: `${'dd'.repeat(20)}`,
				amount: 8,
				block_slot: 320,
				validatorindex: 12,
				withdrawalindex: 100,
			},
		])
		getSlotProposerSlashings.mockResolvedValue([])
		getSlotAttesterSlashings.mockResolvedValue([
			{
				block_index: 1,
				block_slot: 320,
				block_root: root,
			},
		])

		const withdrawal = await withdrawalResolver.resolve.BlockWithdrawalIndex.resolve({
			$block: {
				$network: network,
				root,
			},
			withdrawalIndex: 100,
		}, context)
		expect(withdrawalResolver.projections.indexInBlock(withdrawal)).toBe(0)
		expect(withdrawalResolver.projections.amountGwei(withdrawal)).toBe(8n)
		expect(withdrawalResolver.projections.$account(withdrawal)).toEqual({
			[EntityMetaKey.Selector]: {
				address: `0x${'dd'.repeat(20)}`,
			},
		})

		const slashing = await slashingResolver.resolve.BlockKindIndexInKind.resolve({
			$block: {
				$network: network,
				root,
			},
			kind: 'attester',
			indexInKind: 1,
		}, context)
		expect(slashingResolver.projections.kind(slashing)).toBe('attester')
		expect(slashingResolver.projections.indexInKind(slashing)).toBe(1)

		getSlotAttestations.mockResolvedValue([])
		getSlotDeposits.mockResolvedValue([])
		getSlotWithdrawals.mockResolvedValue([])
		getSlotProposerSlashings.mockResolvedValue([])
		getSlotAttesterSlashings.mockResolvedValue([])
		const empty = await slotDutyResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 320,
		}, context)
		expect(slotDutyResolver.projections.$$beaconAttestations.select(empty)).toEqual([])
		expect(slotDutyResolver.projections.$$beaconAttestations.resolveCount(empty)).toBe(0)
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
