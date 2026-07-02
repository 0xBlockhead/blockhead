// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MevBuilderSelector {
	EvmNetworkBuilderPubkey = 'EvmNetworkBuilderPubkey',
}
export default {
	entityType: EntityType.MevBuilder,
	label: 'MEV builder',
	labelPlural: 'MEV builders',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'builderPubkey',
				label: 'Builder public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevBuilder_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$deliveredPayloads',
				label: 'Delivered payloads',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevRelay_ProposerPayloadDelivered,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
