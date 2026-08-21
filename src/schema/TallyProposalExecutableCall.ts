// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TallyProposalExecutableCall,
	labels: {
		singular: 'Tally proposal executable call',
		plural: 'Tally proposal executable calls',
	},
	description: 'One ordered executable call declared by a Tally proposal.',
})({
	$proposal: {
		entityType: EntityType.TallyProposal,
		cardinality: EntityFieldCardinality.One,
	},
	index: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	$target: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	calldata: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	callType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
})({
	selectors: {
		ProposalIndex: [
			'$proposal',
			'index',
		],
	},
})
