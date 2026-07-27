// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitRef,
	labels: {
		singular: 'Git ref',
		plural: 'Git refs',
	},
})({
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		label: 'ref name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refKind: {
		label: 'ref kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbolicTarget: {
		label: 'symbolic target',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$observations: {
		label: 'observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitRefObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryRefName: [
			'$repository',
			'refName',
		],
	},
})
