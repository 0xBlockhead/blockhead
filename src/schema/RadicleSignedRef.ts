import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum RadicleSignedRefSelector {
	RepositoryNodeIdRefName = '$repository+nodeId+refName',
}
export default {
	entityType: EntityType.RadicleSignedRef,
	label: 'radicle signed ref',
	labelPlural: 'radicle signed refs',
	selectors: [
		{
			name: RadicleSignedRefSelector.RepositoryNodeIdRefName,
			fields: [
				'$repository',
				'nodeId',
				'refName',
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
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'refName',
			label: 'ref name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetObjectId',
			label: 'target object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$gitRef',
			label: 'Git ref',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRef,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$refObservation',
			label: 'ref observation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRefObservation_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadicleSignedRef_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
