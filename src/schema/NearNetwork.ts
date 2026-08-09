// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearNetwork,
	labels: {
		singular: 'near network',
		plural: 'near networks',
	},
	description: 'NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from declared NEAR sources.',
})({
	slug: {
		primitiveType: type('string').matching('^[abcdefghijklmnopqrstuvwxyz0123456789\\-]+$').atLeastLength(1),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	environment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	rpcEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.NearNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$blocks: {
		entityType: EntityType.NearBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearBlocks_Rest,
			Source.NearRpc_JsonRpc,
		],
	},
	$$validators: {
		entityType: EntityType.NearValidator,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		Slug: [
			'slug',
		],
	},
})
