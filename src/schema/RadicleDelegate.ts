// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleDelegateSelector {
	RepositoryDid = 'RepositoryDid',
}
export default {
	entityType: EntityType.RadicleDelegate,
	label: 'radicle delegate',
	labelPlural: 'radicle delegates',
	selectors: [
		{
			name: RadicleDelegateSelector.RepositoryDid,
			fields: [
				'$repository',
				'did',
			],
		},
	],
	fields: [
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RadicleRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'did',
			label: 'DID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'role',
			label: 'role',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validFromRevision',
			label: 'valid from revision',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validToRevision',
			label: 'valid to revision',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
