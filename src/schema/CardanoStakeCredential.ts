// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoStakeCredential,
	labels: {
		singular: 'cardano stake credential',
		plural: 'cardano stake credentials',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	credential: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegationEpochs: {
		entityType: EntityType.CardanoStakeDelegation_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		entityType: EntityType.CardanoAddress,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCredential: [
			'$network',
			'credential',
		],
	},
})
