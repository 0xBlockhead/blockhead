import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MevBuilderSelector {
	EvmNetworkBuilderPubkey = 'evmNetworkBuilderPubkey',
	NetworkBuilderPubkey = '$network+builderPubkey',
}
export default {
	entityType: EntityType.MevBuilder,
	label: 'mev builder',
	labelPlural: 'mev builders',
	selectors: [
		{
			name: MevBuilderSelector.EvmNetworkBuilderPubkey,
			fields: [
				'$network',
				'builderPubkey',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'builderPubkey',
			label: 'builder public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevBuilder_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$deliveredPayloads',
			label: 'delivered payloads',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
