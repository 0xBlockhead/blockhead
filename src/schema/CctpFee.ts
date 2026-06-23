import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CctpFeeSelector {
	ApiHostFromDomainToDomain = 'apiHostFromDomainToDomain',
}
export default {
	entityType: EntityType.CctpFee,
	label: 'cctp fee',
	labelPlural: 'cctp fees',
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
			label: 'API host',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromDomain',
			label: 'from domain',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toDomain',
			label: 'to domain',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rows',
			label: 'rows',
			type: EntityFieldType.Primitive,
			primitiveType: type({"finalityThreshold": "number", "minimumFee": "number"}).array(),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
