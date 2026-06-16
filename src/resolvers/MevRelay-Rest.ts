import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { MevRelay_ProposerPayloadDeliveredSelector } from '$/schema/MevRelay_ProposerPayloadDelivered.ts'
import { MevBuilderSelector } from '$/schema/MevBuilder.ts'

const parsePayloadSlot = (payload: ProposerPayloadDelivered): number | undefined => {
	const raw = payload.slot
	if (raw == null) return undefined
	const slot = Number(raw)
	return Number.isFinite(slot) ? slot : undefined
}

const parsePayloadValueWei = (payload: ProposerPayloadDelivered): bigint | undefined => {
	const raw = payload.value
	if (raw == null) return undefined
	try {
		return BigInt(String(raw))
	} catch {
		return undefined
	}
}

const parsePayloadBlockNumber = (payload: ProposerPayloadDelivered): bigint | undefined => {
	const raw = payload.block_number ?? payload.blockNumber
	if (raw == null) return undefined
	try {
		const trimmed = String(raw)
		return BigInt(trimmed.startsWith('0x') || trimmed.startsWith('0X') ? trimmed : trimmed)
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
				[MevRelay_ProposerPayloadDeliveredSelector.EvmNetworkRelayHostSlotBlockHash]: async (entitySelector) => {
				const wantHash = hexLowerOfByteSize(entitySelector.blockHash, 32)
				if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity selector')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(entitySelector.relayHost, {
					limit: 200,
				})
				const payload = deliveredPayloads.find((deliveredPayload) => {
					const slot = parsePayloadSlot(deliveredPayload)
					const bh = deliveredPayload.block_hash ?? deliveredPayload.blockHash
					if (slot !== entitySelector.slot || bh == null) return false
					const normalized = hexLowerOfByteSize(bh, 32)
					return normalized === wantHash
				})
				if (payload == null) throw new Error('MevRelay_Rest: relay payload not found for id')
				const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
				const blockNumber = parsePayloadBlockNumber(payload)
				const valueWei = parsePayloadValueWei(payload)
				return {
					[EntityMetaKey.Selector]: entitySelector,
					...(builderPubkey != null && builderPubkey !== '' && { builderPubkey }),
					...(valueWei != null && { value: valueWei }),
					...(blockNumber != null && {
						blockNumber,
						$executionBlock: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								blockNumber,
							},
							number: blockNumber,
						} satisfies Entity<typeof schema, EntityType.EvmBlock>,
					}),
				}
			}
			}
		})({
				fields: {
			builderPubkey: (snapshot) => snapshot.builderPubkey,
			value: (snapshot) => snapshot.value,
			blockNumber: (snapshot) => snapshot.blockNumber,
			$executionBlock: (snapshot) => snapshot.$executionBlock,
		},
			}),

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.MevBuilder,
			resolve: {
				[MevBuilderSelector.EvmNetworkBuilderPubkey]: async ({ $network, builderPubkey }) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number($network.caip2.reference)
				let deliveredPayloadCount = 0
				for (const { host } of mevRelayHosts.filter((mevRelayHost) => mevRelayHost.chainId === chainId)) {
					deliveredPayloadCount += (
						(await getProposerPayloadDeliveredForRelayHost(host, { limit: 200 }))
							.filter((payload) => (payload.builder_pubkey ?? payload.builderPubkey) === builderPubkey)
							.length
					)
				}
				return {
					deliveredPayloadCount,
				}
			}
			}
		})({
				fields: {
			deliveredPayloadCount: (snapshot) => snapshot.deliveredPayloadCount,
		},
			}),

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entitySelector.caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
					.map((mevRelayHost) => mevRelayHost.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`
					)
				}
				const subsetRowLimit = resolverContextRowLimit(context)
				const hosts = [...hostsForChain]
				const out: {
					[EntityMetaKey.Selector]: {
						$network: typeof entitySelector
						relayHost: string
						slot: number
						blockHash: `0x${string}`
					}
				}[] = []
				for (const relayHost of hosts) {
					const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(relayHost, {
						limit: Math.min(subsetRowLimit, 200),
					})
					for (const payload of deliveredPayloads) {
						const slot = parsePayloadSlot(payload)
						const bhRaw = payload.block_hash ?? payload.blockHash
						if (slot == null || bhRaw == null) continue
						const blockHash = hexLowerOfByteSize(bhRaw, 32)
						if (blockHash == null) continue
						out.push({
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								relayHost,
								slot,
								blockHash,
							},
						})
						if (out.length >= subsetRowLimit) return out
					}
				}
				if (out.length === 0) {
					throw new Error(
						`MevRelay_Rest: no proposer_payload_delivered payloads for chain ${String(chainId)}`
					)
				}
				return out
			}
			}
		})({
				fields: {
			$$mevProposerPayloadDelivered: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.MevRelay_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
					.map((mevRelayHost) => mevRelayHost.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`
					)
				}
				const subsetRowLimit = resolverContextRowLimit(context)
				const seen = new Set<string>()
				for (const relayHost of hostsForChain) {
					const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(relayHost, {
						limit: Math.min(subsetRowLimit * 8, 200),
					})
					for (const payload of deliveredPayloads) {
						const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
						if (builderPubkey == null || builderPubkey === '') continue
						seen.add(builderPubkey)
						if (seen.size >= subsetRowLimit) break
					}
					if (seen.size >= subsetRowLimit) break
				}
				return [...seen].map((builderPubkey) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2,
						},
						builderPubkey,
					},
				}))
			}
			}
		})({
				fields: {
			$$mevBuilders: (snapshot) => snapshot,
		},
			}),
	],
}
