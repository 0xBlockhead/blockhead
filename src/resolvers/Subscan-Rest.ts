import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	subscanPolkadotRestEndpoints,
} from '$/sources/Subscan/index.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { networkSlug: string } | { slug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.polkadot.caip2.namespace
		|| network.caip2.reference !== networkBySlug.polkadot.caip2.reference
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
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, blockNumber }, context) => {
					assertPolkadotMainnet($network)
					const { getBlock } = await import('$/sources/Subscan/Rest/queries.ts')
					const block = (await getBlock({
						restBaseUrl: subscanPolkadotRestEndpoints[0].url,
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
				}
			},
		})({
			fields: {
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				stateRoot: (snapshot) => snapshot.stateRoot,
				extrinsicsRoot: (snapshot) => snapshot.extrinsicsRoot,
			},
		}),

		defineResolver(Source.Subscan_Rest, {
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				[PolkadotExtrinsicSelector.PolkadotBlockExtrinsicIndex]: async ({ $block, extrinsicIndex }, context) => {
					assertPolkadotMainnet($block.$network)
					const { getExtrinsic } = await import('$/sources/Subscan/Rest/queries.ts')
					const extrinsic = (await getExtrinsic({
						restBaseUrl: subscanPolkadotRestEndpoints[0].url,
						extrinsicIndex: `${$block.blockNumber.toString()}-${extrinsicIndex}`,
						publicEnv: context.publicEnv,
					})).data
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
				}
			},
		})({
			fields: {
				hash: (snapshot) => snapshot.hash,
				$signer: (snapshot) => snapshot.$signer,
				$pallet: (snapshot) => snapshot.$pallet,
				callName: (snapshot) => snapshot.callName,
				success: (snapshot) => snapshot.success,
			},
		}),
	],
}
