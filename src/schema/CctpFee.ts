import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CctpFeeSelector {
	ApiHostFromDomainToDomain = 'apiHostFromDomainToDomain',
}


const cctpFeeRow = type({
	finalityThreshold: 'number',
	minimumFee: 'number',
})

export default {
	entityType: EntityType.CctpFee,

	label: 'CCTP Fee',
	labelPlural: 'CCTP Fees',

	selectors: [
		{
			name: CctpFeeSelector.ApiHostFromDomainToDomain,
			fields: [
				'apiHost',
				'fromDomain',
				'toDomain',
			],
		},
	],

	fields: [
		{
			name: 'apiHost',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromDomain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toDomain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rows',
			type: EntityFieldType.Primitive,
			primitiveType: cctpFeeRow.array(),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
