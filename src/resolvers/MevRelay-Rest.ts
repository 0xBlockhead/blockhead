import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { BidTrace } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const parsePayloadSlot = (payload: BidTrace) => {
	const slot = Number(payload.slot)
	return Number.isFinite(slot) ? slot : undefined
}

const parsePayloadValueWei = (payload: BidTrace) => {
	try {
		return BigInt(payload.value)
	} catch {
		return undefined
	}
}

const parsePayloadBlockNumber = (payload: BidTrace) => {
	try {
		return BigInt(payload.block_number)
	} catch {
		return undefined
	}
}

const relayHostsForChainId = async (chainId: number) => {
	const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
	const hosts = mevRelayHosts
		.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
		.map((mevRelayHost) => mevRelayHost.host)
	if (hosts.length === 0)
		throw new Error(`MevRelay_Rest: no relay hosts for chain ${chainId}`)
	return hosts
}

const deliveredPayloadReference = <_Network>(
	$network: _Network,
	relayHost: string,
	payload: BidTrace
) => {
	const slot = parsePayloadSlot(payload)
	const blockHash = hexLowerOfByteSize(payload.block_hash, 32)
	if (slot == null || blockHash == null) return undefined

	return {
		[EntityMetaKey.Selector]: {
			$network,
			relayHost,
			slot,
			blockHash,
		},
	}
}

export default {
	source: Source.MevRelay_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			resolve: {
				EvmNetworkRelayHostSlotBlockHash: {
					resolve: async (entitySelector) => {
						const wantHash = hexLowerOfByteSize(entitySelector.blockHash, 32)
						if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity selector')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const [payload] = await getProposerPayloadDeliveredForRelayHost(entitySelector.relayHost, {
							limit: 1,
							slot: entitySelector.slot,
							block_hash: wantHash,
						})
						if (payload == null) throw new Error('MevRelay_Rest: relay payload not found for id')

						const blockNumber = parsePayloadBlockNumber(payload)
						const valueWei = parsePayloadValueWei(payload)
						return {
							[EntityMetaKey.Selector]: entitySelector,
							...(payload.builder_pubkey !== '' && {
								builderPubkey: payload.builder_pubkey,
								$builder: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										builderPubkey: payload.builder_pubkey,
									},
								},
							}),
							...(valueWei != null && { value: valueWei }),
							...(blockNumber != null && {
								blockNumber,
								$executionBlock: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										blockNumber,
									},
								},
							}),
						}
					},
				},
			},
		})({
				builderPubkey: (snapshot) => snapshot.builderPubkey,
				$builder: (snapshot) => snapshot.$builder,
				value: (snapshot) => snapshot.value,
				blockNumber: (snapshot) => snapshot.blockNumber,
				$executionBlock: (snapshot) => snapshot.$executionBlock,
			}),

		defineResolver({
			entityType: EntityType.MevRelay,
			resolve: {
				EvmNetworkHost: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$relay: entitySelector,
								timestampMs: Date.now(),
								source: Source.MevRelay_Rest,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.MevRelay_Timestamp,
			resolve: {
				RelayTimestampMsSource: {
					resolve: async ({ $relay, source }, context) => {
						if (source !== Source.MevRelay_Rest)
							throw new Error('MevRelay_Rest: MevRelay_Timestamp selector source mismatch')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const sampleLimit = Math.min(200, Math.max(1, resolverContextRowLimit(context)))
						const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost($relay.host, {
							limit: sampleLimit,
						})

						const builderPubkeys = new Set<string>()
						let windowStartSlot: number | undefined
						let windowEndSlot: number | undefined
						for (const payload of deliveredPayloads) {
							if (payload.builder_pubkey !== '') builderPubkeys.add(payload.builder_pubkey)
							const slot = parsePayloadSlot(payload)
							if (slot != null) {
								windowStartSlot = windowStartSlot == null ? slot : Math.min(windowStartSlot, slot)
								windowEndSlot = windowEndSlot == null ? slot : Math.max(windowEndSlot, slot)
							}
						}

						return {
							reachable: true,
							deliveredPayloadSampleCount: deliveredPayloads.length,
							builderSampleCount: builderPubkeys.size,
							...(windowStartSlot != null && { windowStartSlot }),
							...(windowEndSlot != null && { windowEndSlot }),
							sampleLimit,
						}
					},
				},
			},
		})({
				reachable: (snapshot) => snapshot.reachable,
				deliveredPayloadSampleCount: (snapshot) => snapshot.deliveredPayloadSampleCount,
				builderSampleCount: (snapshot) => snapshot.builderSampleCount,
				windowStartSlot: (snapshot) => snapshot.windowStartSlot,
				windowEndSlot: (snapshot) => snapshot.windowEndSlot,
				sampleLimit: (snapshot) => snapshot.sampleLimit,
			}),

		defineResolver({
			entityType: EntityType.MevBuilder,
			resolve: {
				EvmNetworkBuilderPubkey: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$builder: entitySelector,
								timestampMs: Date.now(),
								source: Source.MevRelay_Rest,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.MevBuilder_Timestamp,
			resolve: {
				BuilderTimestampMsSource: {
					resolve: async ({ $builder, source }) => {
						if (source !== Source.MevRelay_Rest)
							throw new Error('MevRelay_Rest: MevBuilder_Timestamp selector source mismatch')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number($builder.$network.caip2.reference)
						const relayHosts = await relayHostsForChainId(chainId)
						const sampleLimit = 200

						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((host) => (
								getProposerPayloadDeliveredForRelayHost(host, {
									limit: sampleLimit,
									builder_pubkey: $builder.builderPubkey,
								})
							))
						)

						let deliveredPayloadCount = 0
						let deliveredValueWei = 0n
						let windowStartSlot: number | undefined
						let windowEndSlot: number | undefined
						for (const deliveredPayloads of deliveredPayloadPages) {
							for (const payload of deliveredPayloads) {
								const slot = parsePayloadSlot(payload)
								const valueWei = parsePayloadValueWei(payload)
								deliveredPayloadCount += 1
								if (valueWei != null) deliveredValueWei += valueWei
								if (slot != null) {
									windowStartSlot = windowStartSlot == null ? slot : Math.min(windowStartSlot, slot)
									windowEndSlot = windowEndSlot == null ? slot : Math.max(windowEndSlot, slot)
								}
							}
						}

						return {
							deliveredPayloadCount,
							deliveredValueWei,
							relayCount: relayHosts.length,
							...(windowStartSlot != null && { windowStartSlot }),
							...(windowEndSlot != null && { windowEndSlot }),
							sampleLimit,
						}
					},
				},
			},
		})({
				deliveredPayloadCount: (snapshot) => snapshot.deliveredPayloadCount,
				deliveredValueWei: (snapshot) => snapshot.deliveredValueWei,
				relayCount: (snapshot) => snapshot.relayCount,
				windowStartSlot: (snapshot) => snapshot.windowStartSlot,
				windowEndSlot: (snapshot) => snapshot.windowEndSlot,
				sampleLimit: (snapshot) => snapshot.sampleLimit,
			}),

		defineResolver({
			entityType: EntityType.MevBuilder,
			resolve: {
				EvmNetworkBuilderPubkey: {
					resolve: async (entitySelector, context) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(entitySelector.$network.caip2.reference)
						const relayHosts = await relayHostsForChainId(chainId)
						const sampleLimit = Math.min(200, Math.max(1, resolverContextRowLimit(context)))
						const deliveredPayloadReferences: NonNullable<ReturnType<typeof deliveredPayloadReference>>[] = []

						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((host) => (
								getProposerPayloadDeliveredForRelayHost(host, {
									limit: sampleLimit,
									builder_pubkey: entitySelector.builderPubkey,
								}).then((deliveredPayloads) => ({
									host,
									deliveredPayloads,
								}))
							))
						)
						for (const { host, deliveredPayloads } of deliveredPayloadPages) {
							for (const payload of deliveredPayloads) {
								const reference = deliveredPayloadReference(entitySelector.$network, host, payload)
								if (reference == null) continue
								deliveredPayloadReferences.push(reference)
								if (deliveredPayloadReferences.length >= sampleLimit) return deliveredPayloadReferences
							}
						}

						return deliveredPayloadReferences
					},
				},
			},
		})({
				$$deliveredPayloads: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(entitySelector.caip2.reference)
						const relayHosts = await relayHostsForChainId(chainId)

						const entityLimit = resolverContextRowLimit(context)
						const deliveredPayloadReferences: NonNullable<ReturnType<typeof deliveredPayloadReference>>[] = []

						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((relayHost) => (
								getProposerPayloadDeliveredForRelayHost(relayHost, {
									limit: Math.min(entityLimit, 200),
								}).then((deliveredPayloads) => ({
									relayHost,
									deliveredPayloads,
								}))
							))
						)
						for (const { relayHost, deliveredPayloads } of deliveredPayloadPages) {
							for (const payload of deliveredPayloads) {
								const reference = deliveredPayloadReference(entitySelector, relayHost, payload)
								if (reference == null) continue
								deliveredPayloadReferences.push(reference)
								if (deliveredPayloadReferences.length >= entityLimit) return deliveredPayloadReferences
							}
						}

						return deliveredPayloadReferences
					},
				},
			},
		})({
				Evm: {
					$$mevProposerPayloadDelivered: (snapshot) => snapshot,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const relayHosts = await relayHostsForChainId(chainId)

						const entityLimit = resolverContextRowLimit(context)
						const builderPubkeys = new Set<string>()
						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((relayHost) => (
								getProposerPayloadDeliveredForRelayHost(relayHost, {
									limit: Math.min(entityLimit * 8, 200),
								})
							))
						)
						for (const deliveredPayloads of deliveredPayloadPages) {
							for (const payload of deliveredPayloads) {
								if (payload.builder_pubkey === '') continue
								builderPubkeys.add(payload.builder_pubkey)
								if (builderPubkeys.size >= entityLimit) break
							}
							if (builderPubkeys.size >= entityLimit) break
						}

						return [...builderPubkeys].map((builderPubkey) => ({
							[EntityMetaKey.Selector]: {
								$network: {
									caip2,
								},
								builderPubkey,
							},
						}))
					},
				},
			},
		})({
				Evm: {
					$$mevBuilders: (snapshot) => snapshot,
				},
			}),
	],
} satisfies RegisteredSourceResolverModule
