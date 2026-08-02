import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type LogosBlockchainNetworkId = EntitySelector<typeof schema, EntityType.LogosBlockchainNetwork>

const assertLogosTestnet = (network: LogosBlockchainNetworkId) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug['logos-testnet'].slug
	)
		return

	throw new Error('LogosBlockchainNode_Rest: unsupported network')
}

export default {
	source: Source.LogosBlockchainNode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.LogosBlockchainNetwork,
			resolve: {
				Network: {
					resolve: async (network) => {
						assertLogosTestnet(network)
						const { getCryptarchiaInfo } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const {
							cryptarchia_info: cryptarchiaInfo,
							mode,
						} = await getCryptarchiaInfo()
						return [{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.LogosBlockchainNode_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'lib')]: `0x${cryptarchiaInfo.lib}`,
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'libSlot')]: BigInt(cryptarchiaInfo.lib_slot),
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'tip')]: `0x${cryptarchiaInfo.tip}`,
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'slot')]: BigInt(cryptarchiaInfo.slot),
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'height')]: BigInt(cryptarchiaInfo.height),
								[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'mode')]: (
									mode === 'AwaitingStart' ?
										mode
										:
										mode.Started
								),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
