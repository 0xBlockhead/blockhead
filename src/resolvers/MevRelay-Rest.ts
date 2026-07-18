import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { MevRelay_ProposerPayloadDeliveredSelector } from '$/schema/MevRelay_ProposerPayloadDelivered.ts'
import { MevBuilderSelector } from '$/schema/MevBuilder.ts'
import { MevBuilder_TimestampSelector } from '$/schema/MevBuilder_Timestamp.ts'
import { MevRelaySelector } from '$/schema/MevRelay.ts'
import { MevRelay_TimestampSelector } from '$/schema/MevRelay_Timestamp.ts'

const parsePayloadSlot = (payload: ProposerPayloadDelivered) => {
	const raw = payload.slot
	if (raw == null) return undefined
	const slot = Number(raw)
	return Number.isFinite(slot) ? slot : undefined
}

const parsePayloadValueWei = (payload: ProposerPayloadDelivered) => {
	const raw = payload.value
	if (raw == null) return undefined
	try {
		return BigInt(String(raw))
	} catch {
		return undefined
	}
}

const parsePayloadBlockNumber = (payload: ProposerPayloadDelivered) => {
	const raw = payload.block_number ?? payload.blockNumber
	if (raw == null) return undefined
	try {
		return BigInt(String(raw))
	} catch {
		return undefined
	}
}

export default {
	source: Source.MevRelay_Rest,

	resolvers: [
		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			resolve: {
				[MevRelay_ProposerPayloadDeliveredSelector.EvmNetworkRelayHostSlotBlockHash]: {
					resolve: async (entitySelector) => {
						const wantHash = hexLowerOfByteSize(entitySelector.blockHash, 32)
						if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity selector')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(entitySelector.relayHost, {
							limit: 200,
						})
						const payload = deliveredPayloads.find((deliveredPayload) => {
							const slot = parsePayloadSlot(deliveredPayload)
							const blockHash = deliveredPayload.block_hash ?? deliveredPayload.blockHash
							if (slot !== entitySelector.slot || blockHash == null) return false
							return hexLowerOfByteSize(blockHash, 32) === wantHash
						})
						if (payload == null) throw new Error('MevRelay_Rest: relay payload not found for id')
						const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
						const blockNumber = parsePayloadBlockNumber(payload)
						const valueWei = parsePayloadValueWei(payload)
						return {
							[EntityMetaKey.Selector]: entitySelector,
							...(builderPubkey != null && builderPubkey !== '' && {
								builderPubkey,
								$builder: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										builderPubkey,
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevRelay,
			resolve: {
				[MevRelaySelector.EvmNetworkHost]: {
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevRelay_Timestamp,
			resolve: {
				[MevRelay_TimestampSelector.RelayTimestampMsSource]: {
					resolve: async ({ $relay, source }, context) => {
						if (source !== Source.MevRelay_Rest)
							throw new Error('MevRelay_Rest: MevRelay_Timestamp selector source mismatch')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const sampleLimit = Math.min(200, Math.max(1, resolverContextRowLimit(context)))
						try {
							const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost($relay.host, { limit: sampleLimit })
							const builderPubkeys = new Set<string>()
							let windowStartSlot: number | undefined
							let windowEndSlot: number | undefined
							for (const payload of deliveredPayloads) {
								const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
								if (builderPubkey != null && builderPubkey !== '') builderPubkeys.add(builderPubkey)
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
						} catch (error) {
							return {
								reachable: false,
								sampleLimit,
								error: error instanceof Error ? error.message : String(error),
							}
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
				error: (snapshot) => snapshot.error,
			}),

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevBuilder,
			resolve: {
				[MevBuilderSelector.EvmNetworkBuilderPubkey]: {
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevBuilder_Timestamp,
			resolve: {
				[MevBuilder_TimestampSelector.BuilderTimestampMsSource]: {
					resolve: async ({ $builder, source }) => {
						if (source !== Source.MevRelay_Rest)
							throw new Error('MevRelay_Rest: MevBuilder_Timestamp selector source mismatch')

						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number($builder.$network.caip2.reference)
						let deliveredPayloadCount = 0
						let deliveredValueWei = 0n
						let windowStartSlot: number | undefined
						let windowEndSlot: number | undefined
						let relayCount = 0
						const sampleLimit = 200

						for (const { host } of mevRelayHosts.filter((mevRelayHost) => mevRelayHost.chainId === chainId)) {
							relayCount += 1
							for (const payload of await getProposerPayloadDeliveredForRelayHost(host, { limit: sampleLimit })) {
								if ((payload.builder_pubkey ?? payload.builderPubkey) !== $builder.builderPubkey) continue
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
							relayCount,
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevBuilder,
			resolve: {
				[MevBuilderSelector.EvmNetworkBuilderPubkey]: {
					resolve: async (entitySelector, context) => {
						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(entitySelector.$network.caip2.reference)
						const sampleLimit = Math.min(200, Math.max(1, resolverContextRowLimit(context)))
						const deliveredPayloadReferences: {
							[EntityMetaKey.Selector]: {
								$network: typeof entitySelector.$network
								relayHost: string
								slot: number
								blockHash: `0x${string}`
							}
						}[] = []

						for (const { host } of mevRelayHosts.filter((mevRelayHost) => mevRelayHost.chainId === chainId)) {
							let deliveredPayloads
							try {
								deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(host, { limit: sampleLimit })
							} catch {
								continue
							}

							for (const payload of deliveredPayloads) {
								if ((payload.builder_pubkey ?? payload.builderPubkey) !== entitySelector.builderPubkey) continue
								const slot = parsePayloadSlot(payload)
								const blockHashRaw = payload.block_hash ?? payload.blockHash
								if (slot == null || blockHashRaw == null) continue
								const blockHash = hexLowerOfByteSize(blockHashRaw, 32)
								if (blockHash == null) continue
								deliveredPayloadReferences.push({
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										relayHost: host,
										slot,
										blockHash,
									},
								})
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (entitySelector, context) => {
						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(entitySelector.caip2.reference)
						const relayHosts = mevRelayHosts
							.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
							.map((mevRelayHost) => mevRelayHost.host)
						if (relayHosts.length === 0)
							throw new Error(`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`)

						const entityLimit = resolverContextRowLimit(context)
						const deliveredPayloadReferences: {
							[EntityMetaKey.Selector]: {
								$network: typeof entitySelector
								relayHost: string
								slot: number
								blockHash: `0x${string}`
							}
						}[] = []

						for (const relayHost of relayHosts) {
							let deliveredPayloads
							try {
								deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(relayHost, {
									limit: Math.min(entityLimit, 200),
								})
							} catch {
								continue
							}

							for (const payload of deliveredPayloads) {
								const slot = parsePayloadSlot(payload)
								const blockHashRaw = payload.block_hash ?? payload.blockHash
								if (slot == null || blockHashRaw == null) continue
								const blockHash = hexLowerOfByteSize(blockHashRaw, 32)
								if (blockHash == null) continue
								deliveredPayloadReferences.push({
									[EntityMetaKey.Selector]: {
										$network: entitySelector,
										relayHost,
										slot,
										blockHash,
									},
								})
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

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async ({ caip2 }, context) => {
						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const relayHosts = mevRelayHosts
							.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
							.map((mevRelayHost) => mevRelayHost.host)
						if (relayHosts.length === 0)
							throw new Error(`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`)

						const entityLimit = resolverContextRowLimit(context)
						const builderPubkeys = new Set<string>()
						for (const relayHost of relayHosts) {
							let deliveredPayloads
							try {
								deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(relayHost, {
									limit: Math.min(entityLimit * 8, 200),
								})
							} catch {
								continue
							}

							for (const payload of deliveredPayloads) {
								const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
								if (builderPubkey == null || builderPubkey === '') continue
								builderPubkeys.add(builderPubkey)
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
}
