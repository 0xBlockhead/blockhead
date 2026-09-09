import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

import type { SourcePublicEnv } from '$/sources/$sources.ts'

const loadQueries = async () => {
	if (typeof window === 'undefined')
		return import('$/sources/Avail/JsonRpc/queries.ts')

	const remote = await import('$/sources/Avail/JsonRpc/queries.remote.ts')
	return {
		getNetworkIdentity: (_publicEnv: SourcePublicEnv) => remote.getNetworkIdentity(),
		getSystemHealth: (_publicEnv: SourcePublicEnv) => remote.getSystemHealth(),
		getSystemSyncState: (_publicEnv: SourcePublicEnv) => remote.getSystemSyncState(),
		getFinalizedHead: (_publicEnv: SourcePublicEnv) => remote.getFinalizedHead(),
		getBlockHash: (_publicEnv: SourcePublicEnv, blockNumber?: bigint) => remote.getBlockHash(blockNumber),
		getHeader: (_publicEnv: SourcePublicEnv, blockHash?: string) => remote.getHeader(blockHash),
		getBlock: (_publicEnv: SourcePublicEnv, blockHash: string) => remote.getBlock(blockHash),
		getBlockTimestamp: (_publicEnv: SourcePublicEnv, blockHash: string) => remote.getBlockTimestamp(blockHash),
		getHeaderByBlockNumber: (_publicEnv: SourcePublicEnv, blockNumber: bigint) => remote.getHeaderByBlockNumber(blockNumber),
		getDataProof: (_publicEnv: SourcePublicEnv, blockHash: string, extrinsicIndex: number) => remote.getDataProof({
			blockHash,
			extrinsicIndex,
		}),
	}
}

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const availSubmissionCoordinates = (submissionKey: string) => {
	const match = /^(0|[1-9][0-9]*):(0|[1-9][0-9]*)$/.exec(submissionKey)
	if (match == null)
		throw new Error('Avail: submission key must be blockNumber:extrinsicIndex')

	const blockNumber = BigInt(match[1])
	const extrinsicIndex = Number(match[2])
	if (
		blockNumber > 4_294_967_295n
		|| !Number.isSafeInteger(extrinsicIndex)
		|| extrinsicIndex > 4_294_967_295
	)
		throw new Error('Avail: submission coordinates must be unsigned 32-bit integers')

	return {
		blockNumber,
		extrinsicIndex,
	}
}

const assertAvailMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'avail')
		throw new Error('Avail: unsupported network')
}

export default {
	source: Source.Avail,

	resolvers: [
		defineResolver({
			entityType: EntityType.AvailDataSubmission,
			resolve: {
				NetworkSourceSubmissionKey: {
					resolve: async ({
						$network,
						source,
						submissionKey,
					}, context) => {
						assertAvailMainnet($network.$network)
						if (source !== Source.Avail)
							throw new Error(`Avail: unsupported data submission source ${source}`)

						const {
							blockNumber,
							extrinsicIndex,
						} = availSubmissionCoordinates(submissionKey)
						const {
							getBlock,
							getDataProof,
							getFinalizedHead,
							getHeaderByBlockNumber,
						} = await loadQueries()
						const [
							header,
							finalized,
						] = await Promise.all([
							getHeaderByBlockNumber(context.publicEnv, blockNumber),
							getFinalizedHead(context.publicEnv),
						])
						if (blockNumber > finalized.blockNumber)
							throw new Error('Avail: data submission block is not finalized')

						const block = await getBlock(context.publicEnv, header.hash)
						if (extrinsicIndex >= block.extrinsics.length)
							throw new Error('Avail: data submission extrinsic is absent from block')

						const proof = await getDataProof(
							context.publicEnv,
							header.hash,
							extrinsicIndex
						)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							source,
							submissionKey,
							blockNumber,
							extrinsicIndex,
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									blockNumber,
								},
							},
							dataHash: proof.dataProof.leaf.toLowerCase(),
							commitment: proof.dataProof.roots.blobRoot.toLowerCase(),
							proof,
							proofAvailable: true,
						}
					},
				},
			},
		})({
			$network: (submission) => submission.$network,
			source: (submission) => submission.source,
			submissionKey: (submission) => submission.submissionKey,
			blockNumber: (submission) => submission.blockNumber,
			extrinsicIndex: (submission) => submission.extrinsicIndex,
			$block: (submission) => submission.$block,
			dataHash: (submission) => submission.dataHash,
			commitment: (submission) => submission.commitment,
			proof: (submission) => submission.proof,
			proofAvailable: (submission) => submission.proofAvailable,
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const {
							getBlockHash,
							getFinalizedHead,
							getHeader,
							getNetworkIdentity,
							getSystemHealth,
							getSystemSyncState,
						} = await loadQueries()
						const publicEnv = context.publicEnv
						const [
							identity,
							latestHash,
							finalized,
							health,
							syncState,
						] = await Promise.all([
							getNetworkIdentity(publicEnv),
							getBlockHash(publicEnv),
							getFinalizedHead(publicEnv),
							getSystemHealth(publicEnv),
							getSystemSyncState(publicEnv),
						])
						if (identity.chainName !== 'Avail DA Mainnet')
							throw new Error('Avail: foreign chain name')
						const latest = await getHeader(publicEnv, latestHash)
						const syncing = health.isSyncing || syncState.currentBlock < syncState.highestBlock
						const tipHealth = (
							health.isSyncing ?
								'syncing'
							: health.peers === 0 && health.shouldHavePeers ?
								'no-peers'
							:
								'ok'
						)
						const timestampMs = Date.now()
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.Avail,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockNumber')]: latest.blockNumber,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockHash')]: latestHash,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockNumber')]: finalized.blockNumber,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockHash')]: finalized.hash,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'syncing')]: syncing,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'health')]: tipHealth,
								},
							},
						]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const limit = resolverContextRowLimit(context)

						const {
							getBlock,
							getBlockHash,
							getHeader,
							getHeaderByBlockNumber,
						} = await loadQueries()
						const publicEnv = context.publicEnv
						const tipHash = await getBlockHash(publicEnv)
						const tip = await getHeader(publicEnv, tipHash)
						const tipNumber = tip.blockNumber
						if (
							context.providerContinuationToken != null
							&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
						)
							throw new Error(`${Source.Avail_JsonRpc}: invalid blocks continuation`)

						const cursorNumber = context.providerContinuationToken == null ?
							tipNumber
						:
							BigInt(context.providerContinuationToken)
						if (cursorNumber > tipNumber)
							throw new Error(`${Source.Avail_JsonRpc}: blocks continuation exceeds tip`)

						const blockNumbers = Array.from({
							length: Math.min(Number(cursorNumber + 1n), limit),
						}, (_value, blockOffset) => (
							cursorNumber - BigInt(blockOffset)
						))
						return {
							blocks: await Promise.all(
								blockNumbers.map(async (blockNumber) => {
									const header = (
										blockNumber === tipNumber && tip.hash != null ?
											{
												...tip,
												hash: tip.hash,
											}
										:
											await getHeaderByBlockNumber(publicEnv, blockNumber)
									)
									const block = await getBlock(publicEnv, header.hash)
									return {
										[EntityMetaKey.Selector]: {
											$network: {
												$network,
											},
											blockNumber,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.AvailBlock, [], 'blockHash')]: header.hash,
											[entityFieldAddressKey(EntityType.AvailBlock, [], 'parentHash')]: header.parentHash,
											[entityFieldAddressKey(EntityType.AvailBlock, [], 'stateRoot')]: header.stateRoot,
											[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicsRoot')]: header.extrinsicsRoot,
											[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicCount')]: block.extrinsicCount,
											...(blockNumber > 0n && {
												[entityFieldAddressKey(EntityType.AvailBlock, [], '$parent')]: {
													[EntityMetaKey.Selector]: {
														$network: {
															$network,
														},
														blockNumber: blockNumber - 1n,
													},
												},
											}),
										},
									}
								})
							),
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (snapshot) => snapshot.blocks,
				continuation: (snapshot) => {
					const lastBlockNumber = snapshot.blocks.at(-1)?.[EntityMetaKey.Selector].blockNumber
					return {
						operation: 'network-blocks',
						terminal: lastBlockNumber == null || lastBlockNumber === 0n,
						...(lastBlockNumber != null && lastBlockNumber > 0n && {
							token: String(lastBlockNumber - 1n),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const {
							getBlockHash,
							getHeader,
						} = await loadQueries()
						const tipHash = await getBlockHash(context.publicEnv)
						const tip = await getHeader(context.publicEnv, tipHash)
						return Number(tip.blockNumber + 1n)
					},
				},
			},
		})({
			$$blocks: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						assertAvailMainnet($network.$network)
						if (source !== Source.Avail)
							throw new Error(`Avail: unsupported observation source ${source}`)

						const {
							getBlockHash,
							getFinalizedHead,
							getHeader,
							getNetworkIdentity,
							getSystemHealth,
							getSystemSyncState,
						} = await loadQueries()
						const publicEnv = context.publicEnv
						const [
							identity,
							latestHash,
							finalized,
							health,
							syncState,
						] = await Promise.all([
							getNetworkIdentity(publicEnv),
							getBlockHash(publicEnv),
							getFinalizedHead(publicEnv),
							getSystemHealth(publicEnv),
							getSystemSyncState(publicEnv),
						])
						const latest = await getHeader(publicEnv, latestHash)
						if (identity.chainName !== 'Avail DA Mainnet')
							throw new Error('Avail: foreign chain name')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestBlockNumber: latest.blockNumber,
							latestBlockHash: latestHash,
							finalizedBlockNumber: finalized.blockNumber,
							finalizedBlockHash: finalized.hash,
							syncing: health.isSyncing || syncState.currentBlock < syncState.highestBlock,
							health: (
								health.isSyncing ?
									'syncing'
								: health.peers === 0 && health.shouldHavePeers ?
									'no-peers'
								:
									'ok'
							),
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestBlockNumber: (timestamp) => timestamp.latestBlockNumber,
			latestBlockHash: (timestamp) => timestamp.latestBlockHash,
			finalizedBlockNumber: (timestamp) => timestamp.finalizedBlockNumber,
			finalizedBlockHash: (timestamp) => timestamp.finalizedBlockHash,
			syncing: (timestamp) => timestamp.syncing,
			health: (timestamp) => timestamp.health,
		}),

		defineResolver({
			entityType: EntityType.AvailBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
						assertAvailMainnet($network.$network)
						const {
							getBlock,
							getHeaderByBlockNumber,
						} = await loadQueries()
						const header = await getHeaderByBlockNumber(
							context.publicEnv,
							blockNumber
						)
						const block = await getBlock(context.publicEnv, header.hash)
						return {
							blockNumber: header.blockNumber,
							blockHash: header.hash,
							parentHash: header.parentHash,
							stateRoot: header.stateRoot,
							extrinsicsRoot: header.extrinsicsRoot,
							extrinsicCount: block.extrinsicCount,
							...(header.blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: header.blockNumber - 1n,
									},
								},
							}),
						}
					},
				},
				NetworkBlockHash: {
					resolve: async ({ $network, blockHash }, context) => {
						assertAvailMainnet($network.$network)
						const { getBlock } = await loadQueries()
						const block = await getBlock(context.publicEnv, blockHash)
						const resolvedHash = block.hash ?? blockHash.toLowerCase()
						return {
							blockNumber: block.blockNumber,
							blockHash: resolvedHash,
							parentHash: block.parentHash,
							stateRoot: block.stateRoot,
							extrinsicsRoot: block.extrinsicsRoot,
							extrinsicCount: block.extrinsicCount,
							...(block.blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: block.blockNumber - 1n,
									},
								},
							}),
						}
					},
				},
			},
		})({
			blockNumber: (block) => block.blockNumber,
			blockHash: (block) => block.blockHash,
			parentHash: (block) => block.parentHash,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			extrinsicCount: (block) => block.extrinsicCount,
			$parent: (block) => block.$parent,
		}),

		defineResolver({
			entityType: EntityType.AvailBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
						assertAvailMainnet($network.$network)
						const {
							getBlockHash,
							getBlockTimestamp,
						} = await loadQueries()
						return getBlockTimestamp(
							context.publicEnv,
							await getBlockHash(context.publicEnv, blockNumber)
						)
					},
				},
				NetworkBlockHash: {
					resolve: async ({ $network, blockHash }, context) => {
						assertAvailMainnet($network.$network)
						const { getBlockTimestamp } = await loadQueries()
						return getBlockTimestamp(context.publicEnv, blockHash)
					},
				},
			},
		})({
			timestampMs: (timestampMs) => timestampMs,
		}),
	],
} satisfies RegisteredSourceResolverModule
