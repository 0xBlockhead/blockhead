import { type as arktype } from 'arktype'

import type { SourceResolverModule } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const fixtureSchema = [
	entity({
		entityType: 'ApplicabilityTypeFixture',
		labels: {
			singular: 'Applicability type fixture',
			plural: 'Applicability type fixtures',
		},
	})({
		network: {
			type: EntityFieldType.Primitive,
			primitiveType: arktype({
				namespace: "'eip155' | 'cosmos'",
				reference: 'string',
			}),
			cardinality: EntityFieldCardinality.One,
		},
		slug: {
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		name: {
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
	})({
		selectors: {
			Network: ['network'],
			Slug: ['slug'],
		},
	}),
] as const

const resolve = async () => ({
	name: 'Fixture',
})

const valid = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'ApplicabilityTypeFixture',
		resolve: {
			Network: {
				appliesTo: [{
					network: {
						namespace: 'eip155',
					},
				}],
				resolve,
			},
			Slug: {
				appliesTo: [
					{
						slug: 'ethereum',
					},
					{
						slug: 'optimism',
					},
				],
				resolve,
			},
		},
		projections: {
			name: () => 'Fixture',
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

void valid

const absentSelectorField = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'ApplicabilityTypeFixture',
		resolve: {
			Slug: {
				appliesTo: [{
					// @ts-expect-error A Slug pattern cannot address fields absent from the Slug selector.
					network: {
						namespace: 'eip155',
					},
				}],
				resolve,
			},
		},
		projections: {
			name: () => 'Fixture',
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

const invalidLiteral = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'ApplicabilityTypeFixture',
		resolve: {
			Network: {
				appliesTo: [{
					network: {
						// @ts-expect-error Pattern literals must belong to the selector field's value type.
						namespace: 'solana',
					},
				}],
				resolve,
			},
		},
		projections: {
			name: () => 'Fixture',
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

const wrongSelector = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'ApplicabilityTypeFixture',
		resolve: {
			// @ts-expect-error Resolver selector entries must use a selector declared by the entity.
			Missing: {
				appliesTo: [{
					slug: 'ethereum',
				}],
				resolve,
			},
		},
		projections: {
			name: () => 'Fixture',
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

const emptyPatterns = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'ApplicabilityTypeFixture',
		resolve: {
			Slug: {
				// @ts-expect-error Omit appliesTo for universal applicability; an explicit OR set cannot be empty.
				appliesTo: [],
				resolve,
			},
		},
		projections: {
			name: () => 'Fixture',
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

void absentSelectorField
void invalidLiteral
void wrongSelector
void emptyPatterns

defineResolver(Source.Constants_Internal, {
	entityType: EntityType.Network,
	resolve: {
		Caip2: {
			resolve: async ({ caip2 }) => ({
				caip2,
			}),
		},
	},
})({})

defineResolver(Source.Constants_Internal, {
	entityType: EntityType.Network,
	resolve: {
		// @ts-expect-error A resolver definition cannot introduce a key absent from the entity's selectors.
		Missing: {
			resolve: async () => ({}),
		},
	},
})({})
