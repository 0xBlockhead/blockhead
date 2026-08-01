// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensNetwork,
	labels: {
		singular: 'Lens',
		plural: 'Lens',
	},
	description: 'Lens is a social graph protocol. This hub shows bounded account and post windows from the declared Lens GraphQL source.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('LensNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homeUrl: {
		label: 'Home URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$lensAccounts: {
		label: 'Accounts',
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Lens_Graphql,
		],
	},
	$$lensPosts: {
		label: 'Posts',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lens_Graphql,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
