// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensUsernameNamespace,
	labels: {
		singular: 'Lens username namespace',
		plural: 'Lens username namespaces',
	},
})({
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalUsernames: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rules: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$usernames: {
		entityType: EntityType.LensUsername,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lens_Graphql,
		],
	},
})({
	selectors: {
		Address: [
			'address',
		],
	},
})
