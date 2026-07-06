// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpFeeSelector {
	ApiHostFromDomainToDomain = 'ApiHostFromDomainToDomain',
}
export default {
	entityType: EntityType.CctpFee,
	label: 'CCTP fee',
	labelPlural: 'CCTP fees',
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
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromDomain',
			label: 'From domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toDomain',
			label: 'To domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rows',
			label: 'Rows',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
