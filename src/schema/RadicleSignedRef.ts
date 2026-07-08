// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleSignedRefSelector {
	RepositoryNodeIdRefName = 'RepositoryNodeIdRefName',
}
export const RadicleSignedRef = entity({
	entityType: EntityType.RadicleSignedRef,
	label: 'radicle signed ref',
	labelPlural: 'radicle signed refs',
})({
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		label: 'ref name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$gitRef: {
		label: 'Git ref',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refObservation: {
		label: 'ref observation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRefObservation_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RadicleSignedRef_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryNodeIdRefName: [
			'$repository',
			'nodeId',
			'refName',
		],
	},
})
