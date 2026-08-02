import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { Hex } from '@tevm/voltaire/Hex'

const assertCelestiaMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (!('slug' in network) || network.slug !== 'celestia')
		throw new Error('Celenium_Rest: unsupported network')
}

export default {
	source: Source.Celenium_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertCelestiaMainnet($network)
						const { getHead } = await import('$/sources/Celenium/Rest/queries.ts')
						const head = await getHead()
						const timestampMs = Date.parse(head.last_time)
						if (!Number.isFinite(timestampMs))
							throw new Error('Celenium_Rest: invalid head block time')
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.Celenium_Rest,
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
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []

						const { listBlocks } = await import('$/sources/Celenium/Rest/queries.ts')
						return (
							await listBlocks({
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((block) => ({
							[EntityMetaKey.Selector]: {
								$network: {
									$network,
								},
								height: BigInt(block.height),
							},
						}))
					},
				},
			},
		})({
				$$blocks: (blocks) => blocks,
			}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []

						const { listNamespaces } = await import('$/sources/Celenium/Rest/queries.ts')
						const timestampMs = Date.now()
						return (
							await listNamespaces({
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((namespace) => {
							const namespaceSelector = {
								$network: {
									$network,
								},
								namespaceId: (
									namespace.version.toString(16).padStart(2, '0')
									+ namespace.namespace_id.toLowerCase()
								),
							}
							return {
								[EntityMetaKey.Selector]: namespaceSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CelestiaNamespace, [], 'namespaceVersion')]: namespace.version,
									...(namespace.name != null && {
										[entityFieldAddressKey(EntityType.CelestiaNamespace, [], 'label')]: namespace.name,
									}),
									[entityFieldAddressKey(EntityType.CelestiaNamespace, [], '$$timestamps')]: [
										{
											[EntityMetaKey.Selector]: {
												$namespace: namespaceSelector,
												timestampMs,
												source: Source.Celenium_Rest,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'height')]: BigInt(namespace.last_height),
												[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'blobCount')]: namespace.blobs_count,
											},
										},
									],
								},
							}
						})
					},
				},
			},
		})({
				$$namespaces: (namespaces) => namespaces,
			}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []

						const { listBlobMetadata } = await import('$/sources/Celenium/Rest/queries.ts')
						return (
							await listBlobMetadata({
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((blob) => ({
							[EntityMetaKey.Selector]: {
								$namespace: {
									$network: {
										$network,
									},
									namespaceId: Hex.fromBytes(Uint8Array.from(
										globalThis.atob(blob.namespace),
										(character) => character.charCodeAt(0)
									)).slice(2),
								},
								height: BigInt(blob.height),
								commitment: blob.commitment,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'shareVersion')]: blob.share_version,
								[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'sizeBytes')]: BigInt(blob.size),
								[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'signer')]: blob.signer.hash,
								[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'txHash')]: blob.tx_hash.toLowerCase(),
								[entityFieldAddressKey(EntityType.CelestiaBlob, [], '$block')]: {
									[EntityMetaKey.Selector]: {
										$network: {
											$network,
										},
										height: BigInt(blob.height),
									},
								},
							},
						}))
					},
				},
			},
		})({
				$$blobs: (blobs) => blobs,
			}),

		defineResolver({
			entityType: EntityType.CelestiaBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertCelestiaMainnet($network.$network)
						const { getBlock } = await import('$/sources/Celenium/Rest/queries.ts')
						const block = await getBlock(height)
						const timestampMs = Date.parse(block.time)
						if (!Number.isFinite(timestampMs))
							throw new Error('Celenium_Rest: invalid block time')
						return {
							hash: block.hash.toLowerCase(),
							appHash: block.app_hash.toLowerCase(),
							dataHash: block.data_hash.toLowerCase(),
							proposerAddress: block.proposer.cons_address.toLowerCase(),
							timestampMs,
							blobCount: block.stats.blobs_count,
							transactionCount: block.stats.tx_count,
						}
					},
				},
			},
		})({
				hash: (block) => block.hash,
				appHash: (block) => block.appHash,
				dataHash: (block) => block.dataHash,
				proposerAddress: (block) => block.proposerAddress,
				timestampMs: (block) => block.timestampMs,
				blobCount: (block) => block.blobCount,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						assertCelestiaMainnet($network)
						const { getTransaction } = await import('$/sources/Celenium/Rest/queries.ts')
						const transaction = await getTransaction(txHash)
						return {
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									height: BigInt(transaction.height),
								},
							},
							gasWanted: BigInt(transaction.gas_wanted),
							gasUsed: BigInt(transaction.gas_used),
							feeAmount: [
								{
									denom: 'utia',
									amount: BigInt(transaction.fee),
								},
							],
							signerAddresses: transaction.signers.map((signer) => signer.hash),
						}
					},
				},
			},
		})({
				$block: (transaction) => transaction.$block,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				feeAmount: (transaction) => transaction.feeAmount,
				signerAddresses: (transaction) => transaction.signerAddresses,
			}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						assertCelestiaMainnet($network.$network)
						if (source !== Source.Celenium_Rest)
							throw new Error(`Celenium_Rest: unsupported observation source ${source}`)
						const { getHead } = await import('$/sources/Celenium/Rest/queries.ts')
						const head = await getHead()
						const latestBlockTimeMs = Date.parse(head.last_time)
						if (!Number.isFinite(latestBlockTimeMs))
							throw new Error('Celenium_Rest: invalid head block time')
						if (timestampMs !== latestBlockTimeMs)
							throw new Error('Celenium_Rest: head response does not match the observation time')
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestHeight: BigInt(head.last_height),
							latestHash: head.hash.toLowerCase(),
							latestBlockTimeMs,
							syncing: !head.synced,
						}
					},
				},
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				latestHeight: (timestamp) => timestamp.latestHeight,
				latestHash: (timestamp) => timestamp.latestHash,
				latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
				syncing: (timestamp) => timestamp.syncing,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.Celenium_Rest>
