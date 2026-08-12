import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { BidTrace } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const parsePayloadSlot = (payload: BidTrace) => {
	const slot = Number(payload.slot)
	if (!Number.isSafeInteger(slot) || slot < 0)
		throw new Error(`MevRelay_Rest: invalid BidTrace slot ${payload.slot}`)
	return slot
}

const parsePayloadValueWei = (payload: BidTrace) => {
	const valueWei = BigInt(payload.value)
	if (valueWei < 0n)
		throw new Error(`MevRelay_Rest: invalid BidTrace value ${payload.value}`)
	return valueWei
}

const parsePayloadBlockNumber = (payload: BidTrace) => {
	const blockNumber = BigInt(payload.block_number)
	if (blockNumber < 0n)
		throw new Error(`MevRelay_Rest: invalid BidTrace block number ${payload.block_number}`)
	return blockNumber
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
	const blockHash = hexLowerOfByteSize(payload.block_hash, 32)
	if (blockHash == null) return undefined

	return {
		[EntityMetaKey.Selector]: {
			$network,
			relayHost,
			slot: parsePayloadSlot(payload),
			blockHash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'builderPubkey')]: payload.builder_pubkey,
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$builder')]: {
				[EntityMetaKey.Selector]: {
					$network,
					builderPubkey: payload.builder_pubkey,
				},
			},
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'value')]: parsePayloadValueWei(payload),
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'blockNumber')]: parsePayloadBlockNumber(payload),
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$executionBlock')]: {
				[EntityMetaKey.Selector]: {
					$network,
					blockNumber: parsePayloadBlockNumber(payload),
				},
			},
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

							const blockNumber = parsePayloadBlockNumber(payload)
						const valueWei = parsePayloadValueWei(payload)
						return {
							[EntityMetaKey.Selector]: entitySelector,
							builderPubkey: payload.builder_pubkey,
							$builder: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									builderPubkey: payload.builder_pubkey,
								},
							},
							value: valueWei,
							blockNumber,
							$executionBlock: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									blockNumber,
								},
							},
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
					resolve: async ({ host }) => ({
						url: `https://${host}`,
					}),
				},
			},
		})({
				url: (relay) => relay.url,
			}),

		defineResolver({
			entityType: EntityType.MevRelay,
			resolve: {
				EvmNetworkHost: {
					resolve: async (entitySelector, context) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const sampleLimit = Math.min(200, Math.max(1, resolverContextRowLimit(context)))
						const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(entitySelector.host, {
							limit: sampleLimit,
						})
						const builderPubkeys = new Set<string>()
						let windowStartSlot: number | undefined
						let windowEndSlot: number | undefined
						for (const payload of deliveredPayloads) {
							builderPubkeys.add(payload.builder_pubkey)
							const slot = parsePayloadSlot(payload)
							windowStartSlot = windowStartSlot == null ? slot : Math.min(windowStartSlot, slot)
							windowEndSlot = windowEndSlot == null ? slot : Math.max(windowEndSlot, slot)
						}

						return [
							{
								[EntityMetaKey.Selector]: {
									$relay: entitySelector,
									timestampMs: Date.now(),
									source: Source.MevRelay_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'deliveredPayloadSampleCount')]: deliveredPayloads.length,
									[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'builderSampleCount')]: builderPubkeys.size,
									...(windowStartSlot != null && {
										[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'windowStartSlot')]: windowStartSlot,
									}),
									...(windowEndSlot != null && {
										[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'windowEndSlot')]: windowEndSlot,
									}),
									[entityFieldAddressKey(EntityType.MevRelay_Timestamp, [], 'sampleLimit')]: sampleLimit,
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.MevBuilder,
			resolve: {
				EvmNetworkBuilderPubkey: {
					resolve: async (entitySelector) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const relayHosts = await relayHostsForChainId(Number(entitySelector.$network.caip2.reference))
						const sampleLimit = 200
						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((host) => (
								getProposerPayloadDeliveredForRelayHost(host, {
									limit: sampleLimit,
									builder_pubkey: entitySelector.builderPubkey,
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
								deliveredPayloadCount += 1
								deliveredValueWei += parsePayloadValueWei(payload)
								windowStartSlot = windowStartSlot == null ? slot : Math.min(windowStartSlot, slot)
								windowEndSlot = windowEndSlot == null ? slot : Math.max(windowEndSlot, slot)
							}
						}

						return [{
							[EntityMetaKey.Selector]: {
								$builder: entitySelector,
								timestampMs: Date.now(),
								source: Source.MevRelay_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredPayloadCount')]: deliveredPayloadCount,
								[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredValueWei')]: deliveredValueWei,
								[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'relayCount')]: relayHosts.length,
								...(windowStartSlot != null && {
									[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowStartSlot')]: windowStartSlot,
								}),
								...(windowEndSlot != null && {
									[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowEndSlot')]: windowEndSlot,
								}),
								[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'sampleLimit')]: sampleLimit,
							},
						}]
					},
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
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
