// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandApplicationLocalState_RoundSelector {
	AccountApplicationRoundSource = 'AccountApplicationRoundSource',
}
export default {
	entityType: EntityType.AlgorandApplicationLocalState_Round,
	label: 'algorand application local state round',
	labelPlural: 'algorand application local state rounds',
	selectors: [
		{
			name: AlgorandApplicationLocalState_RoundSelector.AccountApplicationRoundSource,
			fields: [
				'$account',
				'$application',
				'round',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AlgorandAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$application',
				label: 'application',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AlgorandApplication,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'round',
				label: 'round',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'keyValues',
				label: 'key values',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'schema',
				label: 'schema',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deleted',
				label: 'deleted',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
