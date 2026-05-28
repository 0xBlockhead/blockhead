import {
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const subscanPolkadotRestUrl = 'https://polkadot.api.subscan.io'

const assertPolkadotMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Polkadot || network.reference !== '91b171bb158e2d3848fa23a9f1c25182') {
		throw new Error(`Subscan_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

export default {
	source: Source.Subscan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: async (entityId, context) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/Subscan/Rest/queries.ts')
				const block = (await getBlock({
					restBaseUrl: subscanPolkadotRestUrl,
					height: entityId.blockNumber,
					publicEnv: sourcePublicEnv(context, Source.Subscan_Rest),
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: async (entityId, context) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getExtrinsic } = await import('$/sources/Subscan/Rest/queries.ts')
				const extrinsic = (await getExtrinsic({
					restBaseUrl: subscanPolkadotRestUrl,
					extrinsicIndex: `${entityId.$block.blockNumber.toString()}-${entityId.extrinsicIndex}`,
					publicEnv: sourcePublicEnv(context, Source.Subscan_Rest),
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
			},
		}),
	],

	entityFieldResolvers: [],
}
