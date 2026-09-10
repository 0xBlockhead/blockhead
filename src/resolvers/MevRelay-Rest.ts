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

const parsePayloadSafeInteger = (
	label: string,
	value: string
) => {
	const number = Number(value)
	if (!Number.isSafeInteger(number) || number < 0)
		throw new Error(`MevRelay_Rest: invalid BidTrace ${label} ${value}`)
	return number
}

const parsePayloadSlot = (payload: BidTrace) => parsePayloadSafeInteger('slot', payload.slot)

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
	const { mevRelayHosts } = await import('$/sources/MevRelay/constants.ts')
	const hosts = mevRelayHosts
		.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
		.map((mevRelayHost) => mevRelayHost.host)
	if (hosts.length === 0)
		throw new Error(`MevRelay_Rest: no relay hosts for chain ${chainId}`)
	return hosts
}

const executionBlockReference = <_Network>(
	$network: _Network,
	blockHash: string
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		hash: blockHash,
	},
})

const relaySelector = <_Network>(
	$network: _Network,
	host: string
) => ({
	$network,
	host,
})

const deliveredPayloadReference = <_Network>(
	$network: _Network,
	relayHost: string,
	payload: BidTrace
) => {
	const blockHash = hexLowerOfByteSize(payload.block_hash, 32)
	if (blockHash == null) return undefined

	return {
		[EntityMetaKey.Selector]: {
			$relay: relaySelector($network, relayHost),
			slot: parsePayloadSlot(payload),
			blockHash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$builder')]: {
				[EntityMetaKey.Selector]: {
					$network,
					builderPubkey: payload.builder_pubkey,
				},
			},
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'value')]: parsePayloadValueWei(payload),
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'blockNumber')]: parsePayloadBlockNumber(payload),
			[entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$executionBlock')]: executionBlockReference($network, blockHash),
		},
	}
}

const receivedBidReference = <_Network>(
	$network: _Network,
	relayHost: string,
	payload: BidTrace
) => {
	if (payload.timestamp_ms == null)
		return undefined

	const blockHash = hexLowerOfByteSize(payload.block_hash, 32)
	const parentHash = hexLowerOfByteSize(payload.parent_hash, 32)
	if (blockHash == null || parentHash == null)
		throw new Error('MevRelay_Rest: invalid received bid block identity')

	const receivedAtMs = parsePayloadSafeInteger('receipt timestamp', payload.timestamp_ms)
	return {
		[EntityMetaKey.Selector]: {
			$relay: relaySelector($network, relayHost),
			slot: parsePayloadSlot(payload),
			$builder: {
				$network,
				builderPubkey: payload.builder_pubkey,
			},
			blockHash,
			receivedAtMs,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'parentHash')]: parentHash,
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'proposerPubkey')]: payload.proposer_pubkey,
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'proposerFeeRecipient')]: payload.proposer_fee_recipient,
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'valueWei')]: parsePayloadValueWei(payload),
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'gasLimit')]: BigInt(payload.gas_limit),
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'gasUsed')]: BigInt(payload.gas_used),
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'transactionCount')]: parsePayloadSafeInteger('transaction count', payload.num_tx),
			[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'blockNumber')]: parsePayloadBlockNumber(payload),
			...(payload.optimistic_submission != null && {
				[entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'optimisticSubmission')]: payload.optimistic_submission,
			}),
		},
	}
}

const identifiableReceivedBids = <_Network>(
	$network: _Network,
	relayHost: string,
	payloads: BidTrace[]
) => (
	payloads.flatMap((payload) => {
		const reference = receivedBidReference($network, relayHost, payload)
		return reference == null ? [] : [reference]
	})
)

export default {
	source: Source.MevRelay_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.MevRelay_BuilderBlockReceived,
			resolve: {
				RelaySlotBuilderBlockHashReceivedAtMs: {
					resolve: async ({
						$relay,
						slot,
						$builder,
						blockHash,
						receivedAtMs,
					}) => {
						const { getBuilderBlocksReceivedForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const bids = await getBuilderBlocksReceivedForRelayHost($relay.host, {
							limit: 50,
							slot,
							block_hash: blockHash,
							builder_pubkey: $builder.builderPubkey,
						})
						const bid = bids.find((candidate) => (
							candidate.timestamp_ms != null
							&& parsePayloadSafeInteger('receipt timestamp', candidate.timestamp_ms) === receivedAtMs
						))
						if (bid == null)
							throw new Error('MevRelay_Rest: received builder block not found')

						const reference = receivedBidReference($relay.$network, $relay.host, bid)
						if (reference == null)
							throw new Error('MevRelay_Rest: received builder block is missing a receipt clock')
						return reference
					},
				},
			},
		})({
				parentHash: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'parentHash')],
				proposerPubkey: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'proposerPubkey')],
				proposerFeeRecipient: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'proposerFeeRecipient')],
				valueWei: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'valueWei')],
				gasLimit: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'gasLimit')],
				gasUsed: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'gasUsed')],
				transactionCount: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'transactionCount')],
				blockNumber: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'blockNumber')],
				optimisticSubmission: (bid) => bid[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_BuilderBlockReceived, [], 'optimisticSubmission')],
			}),

		defineResolver({
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			resolve: {
				RelaySlotBlockHash: {
					resolve: async ({
						$relay,
						slot,
						blockHash,
					}) => {
						const wantHash = hexLowerOfByteSize(blockHash, 32)
						if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity selector')

						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const payloads = await getProposerPayloadDeliveredForRelayHost($relay.host, {
							limit: 2,
							slot,
							block_hash: wantHash,
						})
						const payload = payloads.at(0)
						if (payload == null)
							throw new Error('MevRelay_Rest: proposer payload not found')
						if (payloads.length > 1)
							throw new Error('MevRelay_Rest: proposer payload selector is ambiguous')

						const reference = deliveredPayloadReference($relay.$network, $relay.host, payload)
						if (reference == null)
							throw new Error('MevRelay_Rest: invalid delivered payload block identity')
						return reference
					},
				},
			},
		})({
				$builder: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$builder')],
				value: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'value')],
				blockNumber: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], 'blockNumber')],
				$executionBlock: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.MevRelay_ProposerPayloadDelivered, [], '$executionBlock')],
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
									sampleLimit,
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
			entityType: EntityType.MevRelay,
			resolve: {
				EvmNetworkHost: {
					resolve: async ({
						$network,
						host,
					}, context) => {
						const { getBuilderBlocksReceivedForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const entityLimit = resolverContextRowLimit(context)
						return identifiableReceivedBids(
							$network,
							host,
							await getBuilderBlocksReceivedForRelayHost(host, {
								limit: Math.min(entityLimit, 200),
							})
						)
							.slice(0, entityLimit)
					},
				},
			},
		})({
				$$receivedBids: (bids) => bids,
			}),

		defineResolver({
			entityType: EntityType.MevRelay,
			resolve: {
				EvmNetworkHost: {
					resolve: async ({
						$network,
						host,
					}, context) => {
						const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const entityLimit = resolverContextRowLimit(context)
						return (
							await getProposerPayloadDeliveredForRelayHost(host, {
								limit: Math.min(entityLimit, 200),
							})
						)
							.flatMap((payload) => {
								const reference = deliveredPayloadReference($network, host, payload)
								return reference == null ? [] : [reference]
							})
							.slice(0, entityLimit)
					},
				},
			},
		})({
				$$deliveredPayloads: (payloads) => payloads,
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
								sampleLimit,
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
			entityType: EntityType.MevBuilder,
			resolve: {
				EvmNetworkBuilderPubkey: {
					resolve: async (entitySelector, context) => {
						const { getBuilderBlocksReceivedForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
						const entityLimit = resolverContextRowLimit(context)
						const receivedBidPages = await Promise.all(
							(await relayHostsForChainId(Number(entitySelector.$network.caip2.reference))).map((relayHost) => (
								getBuilderBlocksReceivedForRelayHost(relayHost, {
									limit: Math.min(entityLimit, 200),
									builder_pubkey: entitySelector.builderPubkey,
								}).then((receivedBids) => ({
									relayHost,
									receivedBids,
								}))
							))
						)
						return receivedBidPages
							.flatMap(({ relayHost, receivedBids }) => identifiableReceivedBids(entitySelector.$network, relayHost, receivedBids))
							.slice(0, entityLimit)
					},
				},
			},
		})({
				$$receivedBids: (bids) => bids,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							getBuilderBlocksReceivedForRelayHost,
							getProposerPayloadDeliveredForRelayHost,
						} = await import('$/sources/MevRelay/Rest/queries.ts')
						const entityLimit = resolverContextRowLimit(context)
						const relayHosts = await relayHostsForChainId(Number(entitySelector.caip2.reference))
						const deliveredPayloadPages = await Promise.all(relayHosts.map((relayHost) => (
							getProposerPayloadDeliveredForRelayHost(relayHost, {
								limit: Math.min(entityLimit, 200),
							}).then((deliveredPayloads) => ({
								relayHost,
								deliveredPayloads,
							}))
						)))
						const receivedBidPages = await Promise.all(deliveredPayloadPages.flatMap(({ relayHost, deliveredPayloads }) => (
							[...new Set(deliveredPayloads.map((payload) => payload.slot))].map((slot) => (
								getBuilderBlocksReceivedForRelayHost(relayHost, {
									limit: Math.min(entityLimit, 200),
									slot,
								}).then((receivedBids) => ({
									relayHost,
									receivedBids,
								}))
							))
						)))
						return receivedBidPages
							.flatMap(({ relayHost, receivedBids }) => identifiableReceivedBids(entitySelector, relayHost, receivedBids))
							.slice(0, entityLimit)
					},
				},
			},
		})({
				Evm: {
					$$mevBuilderBlocksReceived: (bids) => bids,
				},
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
						const timestampMs = Date.now()
						const deliveredPayloadPages = await Promise.all(
							relayHosts.map((relayHost) => (
								getProposerPayloadDeliveredForRelayHost(relayHost, {
									limit: Math.min(entityLimit * 8, 200),
								}).then((deliveredPayloads) => ({
									relayHost,
									deliveredPayloads,
								}))
							))
						)
						const payloadsByBuilderPubkey = new Map<string, {
							deliveredPayloads: NonNullable<ReturnType<typeof deliveredPayloadReference>>[]
							deliveredValueWei: bigint
							relayHosts: Set<string>
							windowStartSlot: number
							windowEndSlot: number
						}>()
						for (const { relayHost, deliveredPayloads } of deliveredPayloadPages) {
							for (const payload of deliveredPayloads) {
								const reference = deliveredPayloadReference({ caip2 }, relayHost, payload)
								if (reference == null) continue
								const slot = parsePayloadSlot(payload)
								const builder = payloadsByBuilderPubkey.get(payload.builder_pubkey) ?? {
									deliveredPayloads: [],
									deliveredValueWei: 0n,
									relayHosts: new Set<string>(),
									windowStartSlot: slot,
									windowEndSlot: slot,
								}
								builder.deliveredPayloads.push(reference)
								builder.deliveredValueWei += parsePayloadValueWei(payload)
								builder.relayHosts.add(relayHost)
								builder.windowStartSlot = Math.min(builder.windowStartSlot, slot)
								builder.windowEndSlot = Math.max(builder.windowEndSlot, slot)
								payloadsByBuilderPubkey.set(payload.builder_pubkey, builder)
							}
						}

						return [...payloadsByBuilderPubkey.entries()]
							.slice(0, entityLimit)
							.map(([builderPubkey, builder]) => {
								const $builder = {
									$network: { caip2 },
									builderPubkey,
								}
								return {
									[EntityMetaKey.Selector]: $builder,
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.MevBuilder, [], '$$deliveredPayloads')]: builder.deliveredPayloads,
										[entityFieldAddressKey(EntityType.MevBuilder, [], '$$timestamps')]: [{
											[EntityMetaKey.Selector]: {
												$builder,
												timestampMs,
												source: Source.MevRelay_Rest,
												sampleLimit: Math.min(entityLimit * 8, 200),
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredPayloadCount')]: builder.deliveredPayloads.length,
												[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'deliveredValueWei')]: builder.deliveredValueWei,
												[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'relayCount')]: builder.relayHosts.size,
												[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowStartSlot')]: builder.windowStartSlot,
												[entityFieldAddressKey(EntityType.MevBuilder_Timestamp, [], 'windowEndSlot')]: builder.windowEndSlot,
											},
										}],
									},
								}
							})
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
