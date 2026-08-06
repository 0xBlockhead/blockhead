// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheDelegator,
	labels: {
		singular: 'avalanche delegator',
		plural: 'avalanche delegators',
	},
})({
	$validator: {
		entityType: EntityType.AvalancheValidator,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	txId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delegatorAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	stakeAmountNavax: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	startTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	endTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	rewardOwnerAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	potentialRewardNavax: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
})({
	selectors: {
		ValidatorTxId: [
			'$validator',
			'txId',
		],
	},
})
