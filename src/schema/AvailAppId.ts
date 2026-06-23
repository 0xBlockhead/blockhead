import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AvailAppIdSelector {
	NetworkAppId = '$network+appId',
}
export default {
	entityType: EntityType.AvailAppId,
	label: 'avail app ID',
	labelPlural: 'avail app IDs',
	selectors: [
		{
			name: AvailAppIdSelector.NetworkAppId,
			fields: [
				'$network',
				'appId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvailNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'appId',
			label: 'app ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ownerSelector',
			label: 'owner selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$dataSubmissions',
			label: 'data submissions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailDataSubmission,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailAppId_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
