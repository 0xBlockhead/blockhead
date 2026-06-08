import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	polkadotMainnetCaip2,
	subscanPolkadotRestBaseUrl,
} from '$/constants/PolkadotNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== polkadotMainnetCaip2.namespace
		|| network.caip2.reference !== polkadotMainnetCaip2.reference
	) {
		throw new Error('Subscan_Rest: unsupported network')
	}
}

export default {
	source: Source.Subscan_Rest,

	resolvers: [
		defineResolver(Source.Subscan_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/Subscan/Rest/queries.ts')
				const block = (await getBlock({
					restBaseUrl: subscanPolkadotRestBaseUrl,
					height: entityId.blockNumber,
					publicEnv: context.publicEnv,
				})).data
				return {
					hash: block.block_hash,
					...(entityId.blockNumber > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: entityId.blockNumber - 1n,
								hash: block.parent_hash,
							},
						},
					}),
					stateRoot: block.state_root,
					extrinsicsRoot: block.extrinsics_root,
				}
			}
			},
			fields: {
			hash: (snapshot) => snapshot.hash,
			$parent: (snapshot) => snapshot.$parent,
			stateRoot: (snapshot) => snapshot.stateRoot,
			extrinsicsRoot: (snapshot) => snapshot.extrinsicsRoot,
		}
		}),

		defineResolver(Source.Subscan_Rest, {
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getExtrinsic } = await import('$/sources/Subscan/Rest/queries.ts')
				const extrinsic = (await getExtrinsic({
					restBaseUrl: subscanPolkadotRestBaseUrl,
					extrinsicIndex: `${entityId.$block.blockNumber.toString()}-${entityId.extrinsicIndex}`,
					publicEnv: context.publicEnv,
				})).data
				return {
					...(extrinsic.extrinsic_hash != null && {
						hash: extrinsic.extrinsic_hash,
					}),
					...(extrinsic.account_id != null && {
						$signer: {
							[EntityMetaKey.Id]: {
								$network: entityId.$block.$network,
								accountId: extrinsic.account_id,
							},
						},
					}),
					$pallet: {
						[EntityMetaKey.Id]: {
							$network: entityId.$block.$network,
							palletName: extrinsic.call_module,
						},
					},
					callName: extrinsic.call_module_function,
					success: extrinsic.success,
				}
			}
			},
			fields: {
			hash: (snapshot) => snapshot.hash,
			$signer: (snapshot) => snapshot.$signer,
			$pallet: (snapshot) => snapshot.$pallet,
			callName: (snapshot) => snapshot.callName,
			success: (snapshot) => snapshot.success,
		}
		}),
	],
}
