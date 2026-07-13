// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleDelegateSelector {
	RepositoryDid = 'RepositoryDid',
}
export const RadicleDelegate = entity({
	entityType: EntityType.RadicleDelegate,
	labels: {
		singular: 'radicle delegate',
		plural: 'radicle delegates',
	},
})({
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		label: 'DID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validFromRevision: {
		label: 'valid from revision',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validToRevision: {
		label: 'valid to revision',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RepositoryDid: [
			'$repository',
			'did',
		],
	},
})
