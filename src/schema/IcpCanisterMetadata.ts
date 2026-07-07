// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterMetadataSelector {
	CanisterMetadataName = 'CanisterMetadataName',
}
export default {
	entityType: EntityType.IcpCanisterMetadata,
	label: 'icp canister metadata',
	labelPlural: 'icp canister metadata entries',
	selectors: [
		{
			name: IcpCanisterMetadataSelector.CanisterMetadataName,
			fields: [
				'$canister',
				'metadataName',
			],
		},
	],
	fields: [
		{
			name: '$canister',
			label: 'canister',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpCanister,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'metadataName',
			label: 'metadata name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpCanisterMetadata_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
