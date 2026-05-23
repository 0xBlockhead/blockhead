import { stringify } from 'devalue'
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
import type { ProposerPayloadDeliveredRowWire } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/$Source.ts'

const parsePayloadSlot = (row: ProposerPayloadDeliveredRowWire): number | undefined => {
	const raw = row.slot
	if (raw == null) return undefined
	const slot = Number(raw)
	return Number.isFinite(slot) ? slot : undefined
}

const parsePayloadValueWei = (row: ProposerPayloadDeliveredRowWire): bigint | undefined => {
	const raw = row.value
	if (raw == null) return undefined
	try {
		return BigInt(String(raw).trim())
	} catch {
		return undefined
	}
}

const parsePayloadBlockNumber = (row: ProposerPayloadDeliveredRowWire): bigint | undefined => {
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
					limit: 1_000,
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
				const chainId = entityId.$network.chainId
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
									$network: { chainId },
									blockNumber,
								},
								number: blockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$mevProposerPayloadDelivered',
			resolve: async (entityId, context) => {
				const { mevRelayHostsByChainId } = await import('$/constants/MevRelayHosts.ts')
				const { getProposerPayloadDeliveredForRelayHost } = await import('$/sources/MevRelay/Rest/queries.ts')
				const hostsForChain = Object.entries(mevRelayHostsByChainId).find(([key]) => (
					Number(key) === entityId.chainId
				))?.[1]
				if (hostsForChain == null) {
					throw new Error(
						`MevRelay_Rest: no MEV-Boost relay mapping for chain ${String(entityId.chainId)}`,
					)
				}
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const hosts = [...hostsForChain]
				const seen = new Set<string>()
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
						limit: subsetRowLimit,
					})
					for (const row of rows) {
						const slot = parsePayloadSlot(row)
						const bhRaw = row.block_hash ?? row.blockHash
						if (slot == null || bhRaw == null) continue
						const blockHash = hexLowerOfByteSize(bhRaw, 32)
						if (blockHash == null) continue
						const idKey = stringify({
							relayHost,
							slot,
							blockHash,
						})
						if (seen.has(idKey)) continue
						seen.add(idKey)
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
						`MevRelay_Rest: no proposer_payload_delivered rows for chain ${String(entityId.chainId)}`,
					)
				}
				return out
			},
		}),
	],
}
