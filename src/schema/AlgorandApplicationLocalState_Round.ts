// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$application: {
		label: 'application',
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyValues: {
		label: 'key values',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schema: {
		label: 'schema',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
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
