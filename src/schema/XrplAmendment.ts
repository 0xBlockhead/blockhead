import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XrplAmendmentSelector {
	NetworkAmendmentId = '$network+amendmentId',
}
export default {
	entityType: EntityType.XrplAmendment,
	label: 'xrpl amendment',
	labelPlural: 'xrpl amendments',
	selectors: [
		{
			name: XrplAmendmentSelector.NetworkAmendmentId,
			fields: [
				'$network',
				'amendmentId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amendmentId',
			label: 'amendment ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplAmendment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
