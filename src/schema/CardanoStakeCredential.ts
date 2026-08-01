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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	credential: {
		label: 'credential',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		label: 'credential kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAddress: {
		label: 'reward address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegationEpochs: {
		label: 'delegation epochs',
		entityType: EntityType.CardanoStakeDelegation_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		label: 'addresses',
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
