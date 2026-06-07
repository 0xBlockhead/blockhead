import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/$Source.ts'

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
		defineResolver({
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const wantHash = hexLowerOfByteSize(entityId.blockHash, 32)
				if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity id')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const deliveredPayloads = await getProposerPayloadDeliveredForRelayHost(entityId.relayHost, {
					limit: 200,
				})
				const payload = deliveredPayloads.find((deliveredPayload) => {
					const slot = parsePayloadSlot(deliveredPayload)
					const bh = deliveredPayload.block_hash ?? deliveredPayload.blockHash
					if (slot !== entityId.slot || bh == null) return false
					const normalized = hexLowerOfByteSize(bh, 32)
					return normalized === wantHash
				})
				if (payload == null) throw new Error('MevRelay_Rest: relay payload not found for id')
				const builderPubkey = payload.builder_pubkey ?? payload.builderPubkey
				const blockNumber = parsePayloadBlockNumber(payload)
				const valueWei = parsePayloadValueWei(payload)
				return {
					[EntityMetaKey.Id]: entityId,
					...(builderPubkey != null && builderPubkey !== '' && { builderPubkey }),
					...(valueWei != null && { value: valueWei }),
					...(blockNumber != null && {
						blockNumber,
						$executionBlock: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber,
							},
							number: blockNumber,
						} satisfies Entity<typeof schema, EntityType.EvmBlock>,
					}),
				}
			},
			fields: {
			builderPubkey: (snapshot) => snapshot.builderPubkey,
			value: (snapshot) => snapshot.value,
			blockNumber: (snapshot) => snapshot.blockNumber,
			$executionBlock: (snapshot) => snapshot.$executionBlock,
		}
		}),

		defineResolver({
			entityType: EntityType.MevBuilder,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.$network.caip2.reference)
				let deliveredPayloadCount = 0
				for (const { host } of mevRelayHosts.filter((mevRelayHost) => mevRelayHost.chainId === chainId)) {
					deliveredPayloadCount += (
						(await getProposerPayloadDeliveredForRelayHost(host, { limit: 200 }))
							.filter((payload) => (payload.builder_pubkey ?? payload.builderPubkey) === entityId.builderPubkey)
							.length
					)
				}
				return {
					deliveredPayloadCount,
				}
			},
			fields: {
			deliveredPayloadCount: (snapshot) => snapshot.deliveredPayloadCount,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
					.map((mevRelayHost) => mevRelayHost.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`,
					)
				}
				const subsetRowLimit = resolverContextRowLimit(context)
				const hosts = [...hostsForChain]
				const out: {
					[EntityMetaKey.Id]: {
						$network: typeof entityId
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
							[EntityMetaKey.Id]: {
								$network: entityId,
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
						`MevRelay_Rest: no proposer_payload_delivered payloads for chain ${String(chainId)}`,
					)
				}
				return out
			},
			fields: {
			$$mevProposerPayloadDelivered: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
					.map((mevRelayHost) => mevRelayHost.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`,
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
					[EntityMetaKey.Id]: {
						$network: entityId,
						builderPubkey,
					},
				}))
			},
			fields: {
			$$mevBuilders: (snapshot) => snapshot,
		}
		}),
	],
}
