// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CelestiaNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.CelestiaNetwork,
	label: 'celestia network',
	labelPlural: 'celestia networks',
	selectors: [
		{
			name: CelestiaNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$namespaces',
			label: 'namespaces',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaNamespace,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blobs',
			label: 'blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaBlob,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
