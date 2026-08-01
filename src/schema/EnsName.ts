// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsName,
	labels: {
		singular: 'ENS name',
		plural: 'ENS names',
	},
})({
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	normalizedName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	node: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labelName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labelhash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$subdomains: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.Many,
	},
	$resolverContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subgraphResolvedActor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ownerActor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	textRecords: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverTextKeys: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverCoinTypes: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$records: {
		entityType: EntityType.EnsRecord,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.EnsName_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NormalizedName: [
			'name',
		],
	},
})
