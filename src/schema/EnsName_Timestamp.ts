// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsName_Timestamp,
	labels: {
		singular: 'ENS name observation',
		plural: 'ENS name observations',
	},
})({
	$name: {
		label: 'Name',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$resolvedActor: {
		label: 'Resolved actor',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resolverContract: {
		label: 'Resolver contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ownerActor: {
		label: 'Owner',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subdomainCount: {
		label: 'Subdomains',
		primitiveType: type('number'),
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
	ttl: {
		label: 'TTL',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isMigrated: {
		label: 'Migrated',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NameTimestampMsSource: [
			'$name',
			'timestampMs',
			'source',
		],
	},
})
