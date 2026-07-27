import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

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

export default {
	source: Source.Subscan_Rest,

	resolvers: [
		defineResolver(Source.Subscan_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber }, context) => {
						assertPolkadotMainnet($network)
						const { getBlock } = await import('$/sources/Subscan/Rest/queries.ts')
						const block = (await getBlock({
							height: blockNumber,
							publicEnv: context.publicEnv,
						})).data
						return {
							hash: block.block_hash,
							...(blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber: blockNumber - 1n,
										hash: block.parent_hash,
									},
								},
							}),
							stateRoot: block.state_root,
							extrinsicsRoot: block.extrinsics_root,
						}
					},
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				stateRoot: (snapshot) => snapshot.stateRoot,
				extrinsicsRoot: (snapshot) => snapshot.extrinsicsRoot,
			}),

		defineResolver(Source.Subscan_Rest, {
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
							|| !Number.isSafeInteger(extrinsic.block_num)
							|| extrinsic.block_num < 0
							|| BigInt(extrinsic.block_num) !== $block.blockNumber
						)
							throw new Error('Subscan_Rest: extrinsic response does not match the subject')
						if (
							extrinsic.account_id === ''
							|| extrinsic.extrinsic_hash === ''
							|| extrinsic.call_module.length === 0
							|| extrinsic.call_module_function.length === 0
						)
							throw new Error('Subscan_Rest: extrinsic response is malformed')

						return {
							...(extrinsic.extrinsic_hash != null && {
								hash: extrinsic.extrinsic_hash,
							}),
							...(extrinsic.account_id != null && {
								$signer: {
									[EntityMetaKey.Selector]: {
										$network: $block.$network,
										accountId: extrinsic.account_id,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
									palletName: extrinsic.call_module,
								},
							},
							callName: extrinsic.call_module_function,
							success: extrinsic.success,
						}
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

		defineResolver(Source.Subscan_Rest, {
			entityType: EntityType.PolkadotReferendum,
			resolve: {
				NetworkReferendumId: {
					resolve: async (entitySelector, context) => {
						assertPolkadotMainnet(entitySelector.$network)
						const { getReferendum } = await import('$/sources/Subscan/Rest/queries.ts')
						const referendum = (await getReferendum({
							referendumIndex: referendumIndexFromId(entitySelector.referendumId),
							publicEnv: context.publicEnv,
						})).data
						if (referendum.referendum_index !== Number(entitySelector.referendumId))
							throw new Error('Subscan_Rest: referendum response does not match the subject')

						return {
							track: referendum.origins,
							submittedAtBlockNumber: BigInt(referendum.created_block),
						}
					},
				}
			},
		})({
				track: (referendum) => referendum.track,
				submittedAtBlockNumber: (referendum) => referendum.submittedAtBlockNumber,
			}),

		defineResolver(Source.Subscan_Rest, {
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
						assertPolkadotMainnet($referendum.$network)
						const { getReferendum } = await import('$/sources/Subscan/Rest/queries.ts')
						const referendum = (await getReferendum({
							referendumIndex: referendumIndexFromId($referendum.referendumId),
							publicEnv: context.publicEnv,
						})).data
						if (referendum.referendum_index !== Number($referendum.referendumId))
							throw new Error('Subscan_Rest: referendum response does not match the observation subject')
						const observation = [...referendum.timeline, {
							block: referendum.latest_block_num,
							status: referendum.status,
							time: referendum.latest_block_timestamp,
						}].findLast((candidate) => candidate.time * 1_000 === timestampMs)
						if (observation == null)
							throw new Error('Subscan_Rest: referendum observation not found')

						return {
							$referendum: {
								[EntityMetaKey.Selector]: $referendum,
							},
							timestampMs,
							source,
							blockNumber: BigInt(observation.block),
							status: observation.status,
							...(observation.time === referendum.latest_block_timestamp && {
								ayeVotes: BigInt(referendum.ayes_amount),
								nayVotes: BigInt(referendum.nays_amount),
							}),
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
			}),
	],
}
