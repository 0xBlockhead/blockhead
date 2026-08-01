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
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	normalizedName: {
		label: 'Normalized name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	node: {
		label: 'Node',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labelName: {
		label: 'Label name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labelhash: {
		label: 'Label hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'Parent',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$subdomains: {
		label: 'Subdomains',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.Many,
	},
	$resolverContract: {
		label: 'Resolver contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subgraphResolvedActor: {
		label: 'Resolved actor',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ownerActor: {
		label: 'Owner',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	textRecords: {
		label: 'Text records',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverTextKeys: {
		label: 'Text record keys',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverCoinTypes: {
		label: 'Resolver coin types',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$records: {
		label: 'Records',
		entityType: EntityType.EnsRecord,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
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
