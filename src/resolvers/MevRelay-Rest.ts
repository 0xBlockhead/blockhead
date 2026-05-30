import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/$Source.ts'

const parsePayloadSlot = (row: ProposerPayloadDelivered): number | undefined => {
	const raw = row.slot
	if (raw == null) return undefined
	const slot = Number(raw)
	return Number.isFinite(slot) ? slot : undefined
}

const parsePayloadValueWei = (row: ProposerPayloadDelivered): bigint | undefined => {
	const raw = row.value
	if (raw == null) return undefined
	try {
		return BigInt(String(raw).trim())
	} catch {
		return undefined
	}
}

const parsePayloadBlockNumber = (row: ProposerPayloadDelivered): bigint | undefined => {
	const raw = row.block_number ?? row.blockNumber
	if (raw == null) return undefined
	try {
		const trimmed = String(raw).trim()
		return BigInt(trimmed.startsWith('0x') || trimmed.startsWith('0X') ? trimmed : trimmed)
	} catch {
		return undefined
	}
}

export default {
	source: Source.MevRelay_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			resolve: async (entityId) => {
				const wantHash = hexLowerOfByteSize(entityId.blockHash, 32)
				if (wantHash == null) throw new Error('MevRelay_Rest: invalid block hash in entity id')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const rows = await getProposerPayloadDeliveredForRelayHost(entityId.relayHost, {
					limit: 200,
				})
				const row = rows.find((entry) => {
					const slot = parsePayloadSlot(entry)
					const bh = entry.block_hash ?? entry.blockHash
					if (slot !== entityId.slot || bh == null) return false
					const normalized = hexLowerOfByteSize(bh, 32)
					return normalized === wantHash
				})
				if (row == null) throw new Error('MevRelay_Rest: relay payload not found for id')
				const builderPubkey = row.builder_pubkey ?? row.builderPubkey
				const blockNumber = parsePayloadBlockNumber(row)
				const valueWei = parsePayloadValueWei(row)
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
		}),

		defineEntityResolver({
			entityType: EntityType.MevBuilder,
			resolve: async (entityId) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.$network.caip2.reference)
				let deliveredPayloadCount = 0
				for (const { host } of mevRelayHosts.filter((row) => row.chainId === chainId)) {
					deliveredPayloadCount += (
						(await getProposerPayloadDeliveredForRelayHost(host, { limit: 200 }))
							.filter((row) => (row.builder_pubkey ?? row.builderPubkey) === entityId.builderPubkey)
							.length
					)
				}
				return {
					deliveredPayloadCount,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$mevProposerPayloadDelivered',
			resolve: async (entityId, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((row) => row.chainId === chainId)
					.map((row) => row.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`,
					)
				}
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
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
					const rows = await getProposerPayloadDeliveredForRelayHost(relayHost, {
						limit: Math.min(subsetRowLimit, 200),
					})
					for (const row of rows) {
						const slot = parsePayloadSlot(row)
						const bhRaw = row.block_hash ?? row.blockHash
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
						`MevRelay_Rest: no proposer_payload_delivered rows for chain ${String(chainId)}`,
					)
				}
				return out
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$mevBuilders',
			resolve: async (entityId, context) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const chainId = Number(entityId.caip2.reference)
				const hostsForChain = mevRelayHosts
					.filter((row) => row.chainId === chainId)
					.map((row) => row.host)
				if (hostsForChain.length === 0) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(chainId)}`,
					)
				}
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const seen = new Set<string>()
				for (const relayHost of hostsForChain) {
					const rows = await getProposerPayloadDeliveredForRelayHost(relayHost, {
						limit: Math.min(subsetRowLimit * 8, 200),
					})
					for (const row of rows) {
						const builderPubkey = row.builder_pubkey ?? row.builderPubkey
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
		}),
	],
}
