import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalIpfsAccessSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalIpfsAccess,
	label: 'global IPFS access',
	labelPlural: 'global IPFS accesses',
	selectors: [
		{
			name: _GlobalIpfsAccessSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'_GlobalIpfsAccess'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowResources',
			label: 'source window resources',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IpfsResource,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalIpfsAccess_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
