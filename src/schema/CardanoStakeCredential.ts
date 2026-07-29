// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	credential: {
		label: 'credential',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		label: 'credential kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAddress: {
		label: 'reward address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegationEpochs: {
		label: 'delegation epochs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoStakeDelegation_Epoch,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		label: 'addresses',
		type: EntityFieldType.EntitiesReference,
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
