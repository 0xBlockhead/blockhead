// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const
const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearNetwork,
	labels: {
		singular: 'near network',
		plural: 'near networks',
	},
	description: 'NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from declared NEAR sources.',
})({
	slug: {
		primitiveType: type.unit('near'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	environment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	rpcEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$timestamps: {
		entityType: EntityType.NearNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$blocks: {
		entityType: EntityType.NearBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$validators: {
		entityType: EntityType.NearValidator,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		Slug: [
			'slug',
		],
	},
})
