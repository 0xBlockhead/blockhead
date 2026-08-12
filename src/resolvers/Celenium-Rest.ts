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

const blobFieldsFromMetadata = (
	blob: {
		share_version: number
		size: number
		signer: {
			hash: string
		}
		tx_hash: string
		height: number
	},
	$network: EntitySelector<typeof schema, EntityType.CelestiaNetwork>
) => ({
	shareVersion: blob.share_version,
	sizeBytes: BigInt(blob.size),
	signer: blob.signer.hash,
	txHash: blob.tx_hash.toLowerCase(),
	$block: {
		[EntityMetaKey.Selector]: {
			$network,
			height: BigInt(blob.height),
		},
	},
})

const blobRefFromMetadata = (
	blob: {
		commitment: string
		share_version: number
		size: number
		signer: {
			hash: string
		}
		tx_hash: string
		height: number
		namespace: string
		namespaceVersion?: number
		namespaceId?: string
	},
	$network: EntitySelector<typeof schema, EntityType.CelestiaNetwork>
) => {
	const namespaceId = (
		blob.namespaceVersion != null && blob.namespaceId != null ?
			(
				blob.namespaceVersion.toString(16).padStart(2, '0')
				+ blob.namespaceId.toLowerCase()
			)
		:
			Hex.fromBytes(Uint8Array.from(
				globalThis.atob(blob.namespace),
				(character) => character.charCodeAt(0)
			)).slice(2)
	)
	const fields = blobFieldsFromMetadata(blob, $network)
	return {
		[EntityMetaKey.Selector]: {
			$namespace: {
				$network,
				namespaceId,
			},
			height: BigInt(blob.height),
			commitment: blob.commitment,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'shareVersion')]: fields.shareVersion,
			[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'sizeBytes')]: fields.sizeBytes,
			[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'signer')]: fields.signer,
			[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'txHash')]: fields.txHash,
			[entityFieldAddressKey(EntityType.CelestiaBlob, [], '$block')]: fields.$block,
		},
	}
}

const blockFieldsFromWire = (
	block: {
		hash: string
		app_hash: string
		data_hash: string
		proposer: {
			cons_address: string
		}
		time: string
		stats: {
			blobs_count: number
			tx_count: number
		}
	}
) => {
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
						const tipFields = {
							latestHeight: BigInt(head.last_height),
							latestHash: head.hash.toLowerCase(),
							latestBlockTimeMs: timestampMs,
							syncing: !head.synced,
							...(head.total_namespaces != null && {
								namespaceCount: head.total_namespaces,
							}),
						}
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.Celenium_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHeight')]: tipFields.latestHeight,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHash')]: tipFields.latestHash,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestBlockTimeMs')]: tipFields.latestBlockTimeMs,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'syncing')]: tipFields.syncing,
									...(tipFields.namespaceCount != null && {
										[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'namespaceCount')]: tipFields.namespaceCount,
									}),
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
						).map((block) => {
							const fields = blockFieldsFromWire(block)
							return {
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									height: BigInt(block.height),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: fields.hash,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: fields.appHash,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: fields.dataHash,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: fields.proposerAddress,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: fields.timestampMs,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'blobCount')]: fields.blobCount,
									[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'transactionCount')]: fields.transactionCount,
								},
							}
						})
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
					resolve: async ({ $network }) => {
						assertCelestiaMainnet($network)
						const { getBlockCount } = await import('$/sources/Celenium/Rest/queries.ts')
						return await getBlockCount()
					},
				},
			},
		})({
				$$blocks: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertCelestiaMainnet($network)
						const { getHead } = await import('$/sources/Celenium/Rest/queries.ts')
						const head = await getHead()
						if (head.total_namespaces == null)
							throw new Error('Celenium_Rest: head missing total_namespaces')
						return head.total_namespaces
					},
				},
			},
		})({
				$$namespaces: {
					resolveCount: (count) => count,
				},
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
									...(namespace.last_message_time != null && {
										[entityFieldAddressKey(EntityType.CelestiaNamespace, [], '$$timestamps')]: [
											{
												[EntityMetaKey.Selector]: {
													$namespace: namespaceSelector,
													timestampMs: Date.parse(namespace.last_message_time),
													source: Source.Celenium_Rest,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'height')]: BigInt(namespace.last_height),
													[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'blobCount')]: namespace.blobs_count,
												},
											},
										],
									}),
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
						const $celestiaNetwork = {
							$network,
						}
						return (
							await listBlobMetadata({
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((blob) => blobRefFromMetadata(blob, $celestiaNetwork))
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
						return {
							...blockFieldsFromWire(await getBlock(height)),
							height,
						}
					},
				},
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertCelestiaMainnet($network.$network)
						const { getBlockByHash } = await import('$/sources/Celenium/Rest/queries.ts')
						const block = await getBlockByHash(hash)
						return {
							...blockFieldsFromWire(block),
							height: BigInt(block.height),
						}
					},
				},
			},
		})({
				hash: (block) => block.hash,
				height: (block) => block.height,
				appHash: (block) => block.appHash,
				dataHash: (block) => block.dataHash,
				proposerAddress: (block) => block.proposerAddress,
				timestampMs: (block) => block.timestampMs,
				blobCount: (block) => block.blobCount,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver({
			entityType: EntityType.CelestiaBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }, context) => {
						assertCelestiaMainnet($network.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []
						const { listBlockBlobs } = await import('$/sources/Celenium/Rest/queries.ts')
						return (
							await listBlockBlobs({
								height,
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((blob) => blobRefFromMetadata(blob, $network))
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
						return (await getBlock(height)).stats.blobs_count
					},
				},
			},
		})({
				$$blobs: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver({
			entityType: EntityType.CelestiaNamespace,
			resolve: {
				NetworkNamespaceId: {
					resolve: async ({ $network, namespaceId }) => {
						assertCelestiaMainnet($network.$network)
						const { getNamespace } = await import('$/sources/Celenium/Rest/queries.ts')
						const namespace = await getNamespace(namespaceId)
						return {
							namespaceVersion: namespace.version,
							...(namespace.name != null && {
								label: namespace.name,
							}),
							...(
								namespace.last_message_time != null && {
									$$timestamps: [
										{
											[EntityMetaKey.Selector]: {
												$namespace: {
													$network,
													namespaceId,
												},
												timestampMs: Date.parse(namespace.last_message_time),
												source: Source.Celenium_Rest,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'height')]: BigInt(namespace.last_height),
												[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'blobCount')]: namespace.blobs_count,
											},
										},
									],
								}
							),
						}
					},
				},
			},
		})({
				namespaceVersion: (namespace) => namespace.namespaceVersion,
				label: (namespace) => namespace.label,
				$$timestamps: (namespace) => namespace.$$timestamps ?? [],
		}),

		defineResolver({
			entityType: EntityType.CelestiaNamespace_Timestamp,
			resolve: {
				NamespaceTimestampMsSource: {
					resolve: async ({ $namespace, timestampMs, source }) => {
						assertCelestiaMainnet($namespace.$network.$network)
						if (source !== Source.Celenium_Rest)
							throw new Error(`Celenium_Rest: unsupported namespace observation source ${source}`)
						const { getNamespace } = await import('$/sources/Celenium/Rest/queries.ts')
						const namespace = await getNamespace($namespace.namespaceId)
						if (namespace.last_message_time == null)
							throw new Error('Celenium_Rest: namespace has no source observation clock')
						if (Date.parse(namespace.last_message_time) !== timestampMs)
							throw new Error('Celenium_Rest: namespace response does not match the observation time')
						return {
							$namespace: {
								[EntityMetaKey.Selector]: $namespace,
							},
							timestampMs,
							source,
							height: BigInt(namespace.last_height),
							blobCount: namespace.blobs_count,
						}
					},
				},
			},
		})({
			$namespace: (timestamp) => timestamp.$namespace,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			height: (timestamp) => timestamp.height,
			blobCount: (timestamp) => timestamp.blobCount,
		}),

		defineResolver({
			entityType: EntityType.CelestiaNamespace,
			resolve: {
				NetworkNamespaceId: {
					resolve: async ({ $network, namespaceId }, context) => {
						assertCelestiaMainnet($network.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []
						const { listNamespaceBlobs } = await import('$/sources/Celenium/Rest/queries.ts')
						return (
							await listNamespaceBlobs({
								namespaceId,
								limit,
								offset: context.pagination.offset ?? 0,
							})
						).map((blob) => blobRefFromMetadata(blob, $network))
					},
				},
			},
		})({
				$$blobs: (blobs) => blobs,
			}),

		defineResolver({
			entityType: EntityType.CelestiaNamespace,
			resolve: {
				NetworkNamespaceId: {
					resolve: async ({ $network, namespaceId }) => {
						assertCelestiaMainnet($network.$network)
						const { getNamespace } = await import('$/sources/Celenium/Rest/queries.ts')
						return (await getNamespace(namespaceId)).blobs_count
					},
				},
			},
		})({
				$$blobs: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver({
			entityType: EntityType.CelestiaBlob,
			resolve: {
				NamespaceHeightCommitment: {
					resolve: async ({ $namespace, height, commitment }) => {
						assertCelestiaMainnet($namespace.$network.$network)
						const { getBlobMetadata } = await import('$/sources/Celenium/Rest/queries.ts')
						return blobFieldsFromMetadata(
							await getBlobMetadata({
								height,
								namespaceId: $namespace.namespaceId,
								commitment,
							}),
							$namespace.$network
						)
					},
				},
			},
		})({
				shareVersion: (blob) => blob.shareVersion,
				sizeBytes: (blob) => blob.sizeBytes,
				signer: (blob) => blob.signer,
				txHash: (blob) => blob.txHash,
				$block: (blob) => blob.$block,
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
							...(transaction.status === 'success' && {
								code: 0,
							}),
							...(transaction.codespace != null && transaction.codespace !== '' && {
								codespace: transaction.codespace,
							}),
							gasWanted: BigInt(transaction.gas_wanted),
							gasUsed: BigInt(transaction.gas_used),
							feeAmount: [
								{
									denom: 'utia',
									amount: BigInt(transaction.fee),
								},
							],
							...(transaction.memo != null && transaction.memo !== '' && {
								memo: transaction.memo,
							}),
							...(transaction.timeout_height > 0 && {
								timeoutHeight: BigInt(transaction.timeout_height),
							}),
							signerAddresses: transaction.signers.map((signer) => signer.hash),
							...(transaction.error != null && transaction.error !== '' && {
								rawLog: transaction.error,
							}),
						}
					},
				},
			},
		})({
				$block: (transaction) => transaction.$block,
				code: (transaction) => transaction.code,
				codespace: (transaction) => transaction.codespace,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				feeAmount: (transaction) => transaction.feeAmount,
				memo: (transaction) => transaction.memo,
				timeoutHeight: (transaction) => transaction.timeoutHeight,
				signerAddresses: (transaction) => transaction.signerAddresses,
				rawLog: (transaction) => transaction.rawLog,
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
							...(head.total_namespaces != null && {
								namespaceCount: head.total_namespaces,
							}),
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
				namespaceCount: (timestamp) => timestamp.namespaceCount,
			}),
	],
} satisfies RegisteredSourceResolverModule
