// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandApplicationLocalState_Round,
	labels: {
		singular: 'algorand application local state round',
		plural: 'algorand application local state rounds',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$application: {
		label: 'application',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyValues: {
		label: 'key values',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schema: {
		label: 'schema',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountApplicationRoundSource: [
			'$account',
			'$application',
			'round',
			'source',
		],
	},
})
