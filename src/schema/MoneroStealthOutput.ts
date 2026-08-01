// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoneroStealthOutput,
	labels: {
		singular: 'monero stealth output',
		plural: 'monero stealth outputs',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'Output index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'Public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	commitment: {
		label: 'Commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		MoneroTransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})
