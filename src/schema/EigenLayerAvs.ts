// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerAvsSelector {
	NetworkAvsAddress = 'NetworkAvsAddress',
}
export default {
	entityType: EntityType.EigenLayerAvs,
	label: 'eigen layer avs',
	labelPlural: 'EigenLayer AVSs',
	selectors: [
		{
			name: EigenLayerAvsSelector.NetworkAvsAddress,
			fields: [
				'$network',
				'avsAddress',
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
				name: 'avsAddress',
				label: 'AVS address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$avsAccount',
				label: 'AVS account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataUri',
				label: 'metadata URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'website',
				label: 'website',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'description',
				label: 'Description',
				description: 'A human-readable description from the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerAvs_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$operators',
				label: 'operators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerOperator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$allocations',
				label: 'allocations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerAllocation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$slashingEvents',
				label: 'slashing events',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerSlashingEvent,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
