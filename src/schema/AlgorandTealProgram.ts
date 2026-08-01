// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandTealProgram,
	labels: {
		singular: 'algorand teal program',
		plural: 'algorand teal programs',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	programHash: {
		label: 'program hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	programKind: {
		label: 'program kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tealVersion: {
		label: 'teal version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AlgorandTealProgram_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$applications: {
		label: 'applications',
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkProgramHash: [
			'$network',
			'programHash',
		],
	},
})
