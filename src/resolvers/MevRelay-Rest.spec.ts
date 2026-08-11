import {
	beforeEach,
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
import { Source } from '$/sources/Source.ts'

const getProposerPayloadDeliveredForRelayHost = vi.hoisted(() => vi.fn())
const getBuilderBlocksReceivedForRelayHost = vi.hoisted(() => vi.fn())

vi.mock('$/sources/MevRelay/Rest/queries.ts', () => ({
	getProposerPayloadDeliveredForRelayHost,
	getBuilderBlocksReceivedForRelayHost,
}))

const { default: mevRelayRest } = await import('$/resolvers/MevRelay-Rest.ts')

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const unsupportedNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '137',
	},
}
const bidTrace = {
	slot: '14917871',
	parent_hash: '0x053111d81bc7dbd54b1519b7d91723627e1681506f76240a133c5805c8ddd620',
	block_hash: '0xae76bc643d558c4dc3b2a4dd0036d2c407f538ed65583131400a1e643c96258e',
	builder_pubkey: '0x88510a78794b69e07f73b2f3ee309f78fc372dcb2ed85d5f80bbe7ebc579778f2a7d6aafbb8b00c00cb7241e1c800d65',
	proposer_pubkey: '0xace2aefa76021d068bb90b461f516d81480a557dacef9196cea762a1b9d6df03c75f895f2dc68bd12ca13060065a59aa',
	proposer_fee_recipient: '0xba1951dF0C0A52af23857c5ab48B4C43A57E7ed1',
	gas_limit: '59999943',
	gas_used: '37301926',
	value: '5316647666874603',
	num_tx: '483',
	block_number: '25680883',
} as const
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const payloadResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MevRelay_ProposerPayloadDelivered
))
const relayUrlResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MevRelay
	&& 'url' in resolver.projections
))
const relayObservationResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MevRelay
	&& '$$timestamps' in resolver.projections
))
const builderResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MevBuilder
	&& '$$timestamps' in resolver.projections
))
const networkPayloadsResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$mevProposerPayloadDelivered' in resolver.projections.Evm
))
const networkBuildersResolver = mevRelayRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$mevBuilders' in resolver.projections.Evm
))

if (
	payloadResolver == null
	|| relayUrlResolver == null
	|| relayObservationResolver == null
	|| builderResolver == null
	|| networkPayloadsResolver == null
	|| networkBuildersResolver == null
)
	throw new Error('MevRelay-Rest spec missing expected resolvers')

describe('MevRelay REST resolvers', () => {
	beforeEach(() => {
		getProposerPayloadDeliveredForRelayHost.mockReset()
		getBuilderBlocksReceivedForRelayHost.mockReset()
	})

	it('resolves a proposer payload by slot + block_hash filter', async () => {
		getProposerPayloadDeliveredForRelayHost.mockResolvedValueOnce([bidTrace])

		const snapshot = await payloadResolver.resolve.EvmNetworkRelayHostSlotBlockHash.resolve({
			$network: network,
			relayHost: 'boost-relay.flashbots.net',
			slot: 14917871,
			blockHash: bidTrace.block_hash,
		}, context)

		expect(getProposerPayloadDeliveredForRelayHost).toHaveBeenCalledWith('boost-relay.flashbots.net', {
			limit: 1,
			slot: 14917871,
			block_hash: bidTrace.block_hash,
		})
		expect(snapshot).toMatchObject({
			builderPubkey: bidTrace.builder_pubkey,
			value: 5316647666874603n,
			blockNumber: 25680883n,
		})
		expect(payloadResolver.projections.$executionBlock(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 25680883n,
			},
		})
		expect(payloadResolver.projections.$builder(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				builderPubkey: bidTrace.builder_pubkey,
			},
		})
	})

	it('rejects negative bid value and block number fields', async () => {
		getProposerPayloadDeliveredForRelayHost.mockResolvedValueOnce([{
			...bidTrace,
			value: '-1',
		}])
		await expect(payloadResolver.resolve.EvmNetworkRelayHostSlotBlockHash.resolve({
			$network: network,
			relayHost: 'boost-relay.flashbots.net',
			slot: 14917871,
			blockHash: bidTrace.block_hash,
		}, context)).rejects.toThrow('invalid BidTrace value')

		getProposerPayloadDeliveredForRelayHost.mockResolvedValueOnce([{
			...bidTrace,
			block_number: '-1',
		}])
		await expect(payloadResolver.resolve.EvmNetworkRelayHostSlotBlockHash.resolve({
			$network: network,
			relayHost: 'boost-relay.flashbots.net',
			slot: 14917871,
			blockHash: bidTrace.block_hash,
		}, context)).rejects.toThrow('invalid BidTrace block number')
	})

	it('projects the enrolled relay URL without requiring observation delivery', async () => {
		const snapshot = await relayUrlResolver.resolve.EvmNetworkHost.resolve({
			$network: network,
			host: 'boost-relay.flashbots.net',
		}, context)

		expect(relayUrlResolver.projections.url(snapshot)).toBe('https://boost-relay.flashbots.net')
		expect(getProposerPayloadDeliveredForRelayHost).not.toHaveBeenCalled()
	})

	it('materializes a complete relay observation in the parent row', async () => {
		getProposerPayloadDeliveredForRelayHost.mockResolvedValueOnce([
			bidTrace,
			{
				...bidTrace,
				slot: '14917880',
				builder_pubkey: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			},
		])
		const snapshot = await relayObservationResolver.resolve.EvmNetworkHost.resolve({
			$network: network,
			host: 'boost-relay.flashbots.net',
		}, context)

		expect(relayObservationResolver.projections.$$timestamps(snapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: expect.any(Number),
				source: Source.MevRelay_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'deliveredPayloadSampleCount')]: 2,
				[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'builderSampleCount')]: 2,
				[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'windowStartSlot')]: 14917871,
				[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'windowEndSlot')]: 14917880,
				[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'sampleLimit')]: 16,
			},
		})
	})

	it('projects enrolled MevBuilder_Timestamp tip leftovers across mapped relays', async () => {
		getProposerPayloadDeliveredForRelayHost
			.mockResolvedValueOnce([bidTrace])
			.mockResolvedValueOnce([
				{
					...bidTrace,
					slot: '14917900',
					value: '100',
				},
			])

		const snapshot = await builderResolver.resolve.EvmNetworkBuilderPubkey.resolve({
			$network: network,
			builderPubkey: bidTrace.builder_pubkey,
		}, context)

		expect(getProposerPayloadDeliveredForRelayHost).toHaveBeenCalledTimes(2)
		expect(builderResolver.projections.$$timestamps(snapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: expect.any(Number),
				source: Source.MevRelay_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredPayloadCount')]: 2,
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredValueWei')]: 5316647666874703n,
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'relayCount')]: 2,
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowStartSlot')]: 14917871,
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowEndSlot')]: 14917900,
				[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'sampleLimit')]: 200,
			},
		})
	})

	it('hard-fails parent relay observations instead of emitting incomplete rows', async () => {
		getProposerPayloadDeliveredForRelayHost.mockRejectedValueOnce(new Error('502 Bad Gateway'))

		await expect(relayObservationResolver.resolve.EvmNetworkHost.resolve({
			$network: network,
			host: 'boost-relay.flashbots.net',
		}, context)).rejects.toThrow('502')
	})

	it('does not expose arbitrary relay or builder timestamp facets', () => {
		expect(mevRelayRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.MevRelay_Timestamp
			|| resolver.entityType === EntityType.MevBuilder_Timestamp
		))).toBe(false)
	})

	it('hard-fails network MEV lists for chains without relay hosts', async () => {
		await expect(networkPayloadsResolver.resolve.Caip2.resolve(unsupportedNetwork, context)).rejects.toThrow('MevRelay_Rest: no relay hosts for chain 137')
		await expect(networkBuildersResolver.resolve.Caip2.resolve(unsupportedNetwork, context)).rejects.toThrow('MevRelay_Rest: no relay hosts for chain 137')
		expect(getProposerPayloadDeliveredForRelayHost).not.toHaveBeenCalled()
	})

	it('returns empty network MEV lists when mapped relays have no matching rows', async () => {
		getProposerPayloadDeliveredForRelayHost.mockResolvedValue([])

		await expect(networkPayloadsResolver.resolve.Caip2.resolve(network, context)).resolves.toEqual([])
		await expect(networkBuildersResolver.resolve.Caip2.resolve(network, context)).resolves.toEqual([])
		expect(getProposerPayloadDeliveredForRelayHost).toHaveBeenCalled()
	})

	it('aggregates network proposer payloads across mapped relays without swallowing failures', async () => {
		getProposerPayloadDeliveredForRelayHost
			.mockResolvedValueOnce([bidTrace])
			.mockRejectedValueOnce(new Error('ultrasound offline'))

		await expect(networkPayloadsResolver.resolve.Caip2.resolve(network, context)).rejects.toThrow('ultrasound offline')
	})
})
