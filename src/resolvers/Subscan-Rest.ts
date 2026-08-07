import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import type { SubscanExtrinsic } from '$/sources/Subscan/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.polkadot.caip2.namespace
		|| network.caip2.reference !== networkBySlug.polkadot.caip2.reference
	) {
		throw new Error('Subscan_Rest: unsupported network')
	}
}

const referendumIndexFromId = (referendumId: string) => {
	const referendumIndex = Number(referendumId)
	if (!Number.isSafeInteger(referendumIndex) || referendumIndex < 0 || String(referendumIndex) !== referendumId)
		throw new Error(`Subscan_Rest: invalid referendum ID ${referendumId}`)
	return referendumIndex
}

const extrinsicIndexInBlock = (extrinsicIndex: string) => {
	const indexInBlock = Number(extrinsicIndex.split('-')[1])
	if (!Number.isSafeInteger(indexInBlock) || indexInBlock < 0)
		throw new Error('Subscan_Rest: malformed extrinsic index')
	return indexInBlock
}

const continuationPage = (token: string | undefined) => {
	if (token == null)
		return 0
	const page = Number(token)
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('Subscan_Rest: invalid continuation page')
	return page
}

const extrinsicFields = (
	$network: NetworkId,
	extrinsic: SubscanExtrinsic
) => ({
	...(extrinsic.extrinsic_hash != null && extrinsic.extrinsic_hash !== '' && {
		hash: extrinsic.extrinsic_hash,
	}),
	...(extrinsic.account_id != null && extrinsic.account_id !== '' && {
		$signer: {
			[EntityMetaKey.Selector]: {
				$network,
				accountId: extrinsic.account_id,
			},
		},
	}),
	$pallet: {
		[EntityMetaKey.Selector]: {
			$network,
			palletName: extrinsic.call_module,
		},
	},
	callName: extrinsic.call_module_function,
	success: extrinsic.success,
})

const polkadotBlockSnapshot = async (
	$network: NetworkId,
	blockNumber: bigint,
	hash: string | undefined,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	const row = Math.min(resolverContextRowLimit(context), 100)
	const page = continuationPage(context.providerContinuationToken)
	const {
		getBlock,
		listBlockExtrinsics,
	} = await import('$/sources/Subscan/Rest/queries.ts')
	const [
		block,
		extrinsics,
	] = await Promise.all([
		getBlock({
			height: blockNumber,
			publicEnv: context.publicEnv,
		}).then((response) => response.data),
		listBlockExtrinsics({
			blockNumber,
			page,
			row,
			publicEnv: context.publicEnv,
		}),
	])
	if (hash != null && block.block_hash !== hash)
		throw new Error('Subscan_Rest: block hash does not match the subject')

	return {
		hash: block.block_hash,
		...(blockNumber > 0n && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network,
					blockNumber: blockNumber - 1n,
					hash: block.parent_hash,
				},
			},
		}),
		stateRoot: block.state_root,
		extrinsicsRoot: block.extrinsics_root,
		page,
		row,
		extrinsicCount: extrinsics.data.count,
		$$extrinsics: extrinsics.data.extrinsics.map((extrinsic) => ({
			[EntityMetaKey.Selector]: {
				$block: {
					$network,
					blockNumber,
					hash: block.block_hash,
				},
				indexInBlock: extrinsicIndexInBlock(extrinsic.extrinsic_index),
			},
			...extrinsicFields($network, extrinsic),
		})),
	}
}

const referendumObservationSnapshot = async (
	entitySelector: {
		$network: NetworkId
		referendumId: string
	},
	context: {
		publicEnv: SourcePublicEnv
	}
) => {
	assertPolkadotMainnet(entitySelector.$network)
	const {
		getReferendum,
		referendumLifecycleBlockNumbers,
	} = await import('$/sources/Subscan/Rest/queries.ts')
	const referendum = (await getReferendum({
		referendumIndex: referendumIndexFromId(entitySelector.referendumId),
		publicEnv: context.publicEnv,
	})).data
	if (referendum.referendum_index !== Number(entitySelector.referendumId))
		throw new Error('Subscan_Rest: referendum response does not match the subject')

	const lifecycle = referendumLifecycleBlockNumbers(referendum)
	const observations = [
		...referendum.timeline,
		{
			block: referendum.latest_block_num,
			status: referendum.status,
			time: referendum.latest_block_timestamp,
		},
	]
	const timestampMsByObservation = new Set<number>()
	const $$timestamps = []
	for (const observation of observations) {
		const timestampMs = observation.time * 1_000
		if (timestampMsByObservation.has(timestampMs))
			continue
		timestampMsByObservation.add(timestampMs)
		const isTip = observation.time === referendum.latest_block_timestamp
		$$timestamps.push({
			[EntityMetaKey.Selector]: {
				$referendum: entitySelector,
				timestampMs,
				source: Source.Subscan_Rest,
			},
			blockNumber: BigInt(observation.block),
			status: observation.status,
			...(isTip && {
				ayeVotes: BigInt(referendum.ayes_amount),
				nayVotes: BigInt(referendum.nays_amount),
				...lifecycle,
				...(referendum.support != null && {
					support: referendum.support,
				}),
				...(referendum.approval != null && {
					approval: referendum.approval,
				}),
			}),
		})
	}

	return {
		track: referendum.origins,
		submittedAtBlockNumber: BigInt(referendum.created_block),
		$$timestamps,
	}
}

export default {
	source: Source.Subscan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
						assertPolkadotMainnet($network)
						return polkadotBlockSnapshot($network, blockNumber, undefined, context)
					},
				},
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber, hash }, context) => {
						assertPolkadotMainnet($network)
						return polkadotBlockSnapshot($network, blockNumber, hash, context)
					},
				},
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				stateRoot: (snapshot) => snapshot.stateRoot,
				extrinsicsRoot: (snapshot) => snapshot.extrinsicsRoot,
				$$extrinsics: {
					select: (snapshot) => snapshot.$$extrinsics.map((extrinsic) => ({
						[EntityMetaKey.Selector]: extrinsic[EntityMetaKey.Selector],
						[EntityMetaKey.Fields]: {
							...(extrinsic.hash != null && {
								[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: extrinsic.hash,
							}),
							...(extrinsic.$signer != null && {
								[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$signer')]: extrinsic.$signer,
							}),
							...(extrinsic.$pallet != null && {
								[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$pallet')]: extrinsic.$pallet,
							}),
							...(extrinsic.callName != null && {
								[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'callName')]: extrinsic.callName,
							}),
							[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'success')]: extrinsic.success,
						},
					})),
					resolveCount: (snapshot) => snapshot.extrinsicCount,
					continuation: (snapshot, entitySelector) => (
						(snapshot.page + 1) * snapshot.row >= snapshot.extrinsicCount
						|| snapshot.$$extrinsics.length === 0 ?
							{
								operation: 'block-extrinsics',
								target: `${entitySelector.blockNumber.toString()}:${'hash' in entitySelector ? entitySelector.hash : snapshot.hash}`,
								terminal: true,
							}
						:
							{
								operation: 'block-extrinsics',
								target: `${entitySelector.blockNumber.toString()}:${'hash' in entitySelector ? entitySelector.hash : snapshot.hash}`,
								terminal: false,
								token: String(snapshot.page + 1),
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				BlockIndexInBlock: {
					resolve: async ({ $block, indexInBlock }, context) => {
						assertPolkadotMainnet($block.$network)
						const { getExtrinsic } = await import('$/sources/Subscan/Rest/queries.ts')
						const extrinsicIndex = `${$block.blockNumber.toString()}-${indexInBlock}`
						const extrinsic = (await getExtrinsic({
							extrinsicIndex,
							publicEnv: context.publicEnv,
						})).data
						if (
							extrinsic.extrinsic_index !== extrinsicIndex
							|| BigInt(extrinsic.block_num) !== $block.blockNumber
						)
							throw new Error('Subscan_Rest: extrinsic response does not match the subject')
						if (
							extrinsic.account_id === ''
							|| extrinsic.extrinsic_hash === ''
						)
							throw new Error('Subscan_Rest: extrinsic response is malformed')

						return extrinsicFields($block.$network, extrinsic)
					},
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$signer: (snapshot) => snapshot.$signer,
				$pallet: (snapshot) => snapshot.$pallet,
				callName: (snapshot) => snapshot.callName,
				success: (snapshot) => snapshot.success,
			}),

		defineResolver({
			entityType: EntityType.PolkadotReferendum,
			resolve: {
				NetworkReferendumId: {
					resolve: async (entitySelector, context) => (
						referendumObservationSnapshot(entitySelector, context)
					),
				}
			},
		})({
				track: (referendum) => referendum.track,
				submittedAtBlockNumber: (referendum) => referendum.submittedAtBlockNumber,
				$$timestamps: (referendum) => referendum.$$timestamps.map((observation) => ({
					[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockNumber')]: observation.blockNumber,
						[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'status')]: observation.status,
						...(observation.ayeVotes != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'ayeVotes')]: observation.ayeVotes,
						}),
						...(observation.nayVotes != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'nayVotes')]: observation.nayVotes,
						}),
						...(observation.confirmationStartedAtBlockNumber != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'confirmationStartedAtBlockNumber')]: observation.confirmationStartedAtBlockNumber,
						}),
						...(observation.decidedAtBlockNumber != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'decidedAtBlockNumber')]: observation.decidedAtBlockNumber,
						}),
						...(observation.enactmentAtBlockNumber != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'enactmentAtBlockNumber')]: observation.enactmentAtBlockNumber,
						}),
						...(observation.support != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'support')]: observation.support,
						}),
						...(observation.approval != null && {
							[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'approval')]: observation.approval,
						}),
					},
				})),
			}),

		defineResolver({
			entityType: EntityType.PolkadotReferendum_Timestamp,
			resolve: {
				ReferendumTimestampMsSource: {
					resolve: async ({
						$referendum,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.Subscan_Rest)
							throw new Error(`Subscan_Rest: unsupported source ${source}`)
						const snapshot = await referendumObservationSnapshot($referendum, context)
						const observation = snapshot.$$timestamps.find((candidate) => (
							candidate[EntityMetaKey.Selector].timestampMs === timestampMs
						))
						if (observation == null)
							throw new Error('Subscan_Rest: referendum observation not found')

						return {
							$referendum: {
								[EntityMetaKey.Selector]: $referendum,
							},
							timestampMs,
							source,
							blockNumber: observation.blockNumber,
							status: observation.status,
							ayeVotes: observation.ayeVotes,
							nayVotes: observation.nayVotes,
							confirmationStartedAtBlockNumber: observation.confirmationStartedAtBlockNumber,
							decidedAtBlockNumber: observation.decidedAtBlockNumber,
							enactmentAtBlockNumber: observation.enactmentAtBlockNumber,
							support: observation.support,
							approval: observation.approval,
						}
					},
				}
			},
		})({
				$referendum: (observation) => observation.$referendum,
				timestampMs: (observation) => observation.timestampMs,
				source: (observation) => observation.source,
				blockNumber: (observation) => observation.blockNumber,
				status: (observation) => observation.status,
				ayeVotes: (observation) => observation.ayeVotes,
				nayVotes: (observation) => observation.nayVotes,
				confirmationStartedAtBlockNumber: (observation) => observation.confirmationStartedAtBlockNumber,
				decidedAtBlockNumber: (observation) => observation.decidedAtBlockNumber,
				enactmentAtBlockNumber: (observation) => observation.enactmentAtBlockNumber,
				support: (observation) => observation.support,
				approval: (observation) => observation.approval,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertPolkadotMainnet(network)
						const { listBlocks } = await import('$/sources/Subscan/Rest/queries.ts')
						const row = Math.min(resolverContextRowLimit(context), 100)
						const page = continuationPage(context.providerContinuationToken)
						const blocks = await listBlocks({
							page,
							row,
							publicEnv: context.publicEnv,
						})
						return {
							page,
							row,
							count: blocks.data.count,
							$$blocks: blocks.data.blocks.map((block) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									blockNumber: BigInt(block.block_num),
									hash: block.hash,
								},
							})),
						}
					},
				},
			},
		})({
				Polkadot: {
					$$blocks: {
						select: (snapshot) => snapshot.$$blocks,
						resolveCount: (snapshot) => BigInt(snapshot.count),
						continuation: (snapshot, network) => (
							(snapshot.page + 1) * snapshot.row >= snapshot.count
							|| snapshot.$$blocks.length === 0 ?
								{
									operation: 'network-blocks',
									target: 'slug' in network ? network.slug : 'polkadot',
									terminal: true,
								}
							:
								{
									operation: 'network-blocks',
									target: 'slug' in network ? network.slug : 'polkadot',
									terminal: false,
									token: String(snapshot.page + 1),
								}
						),
					},
				},
			}),
	],
} satisfies RegisteredSourceResolverModule
