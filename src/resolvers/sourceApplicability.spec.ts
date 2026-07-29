import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'

import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import {
	indexResolvers,
	resolverPartsKey,
	validateResolverDefinitions,
	type SourceResolverDefinitionCandidate,
	type SourceResolverModule,
} from '$/resolvers/$resolvers.ts'
import type { Schema } from '$/schema/$schema.ts'

const fixtureSchema = [{
	entityType: 'FixtureNetwork',
	label: 'Fixture network',
	labelPlural: 'Fixture networks',
	selectors: [
		{
			name: 'Caip2',
			fields: ['caip2'],
		},
		{
			name: 'Slug',
			fields: ['slug'],
		},
	],
	fields: [
		{
			name: 'caip2',
			type: EntityFieldType.Primitive,
			primitiveType: arktype({
				namespace: "'eip155' | 'cosmos'",
				reference: 'string',
			}),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
}] as const satisfies Schema

const fixtureModule = {
	source: 'Fixture',
	resolvers: [{
		entityType: 'FixtureNetwork',
		resolve: {
			Caip2: {
				appliesTo: [
					{
						caip2: {
							namespace: 'cosmos',
						},
					},
					{
						caip2: {
							namespace: 'eip155',
							reference: '10',
						},
					},
				],
				resolve: async () => ({ name: 'Matched' }),
			},
			Slug: {
				resolve: async () => ({ name: 'Universal' }),
			},
		},
		projections: {
			name: (snapshot) => snapshot.name,
			description: {
				parentSelectors: ['Slug'],
				select: () => 'Description',
			},
		},
	}],
} as const satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>

describe('resolver source applicability contract', () => {
	it('compiles recursive selector patterns once and indexes fields by selector', () => {
		const indexed = indexResolvers(fixtureSchema, [fixtureModule], new Set(['Fixture']))
		const resolver = indexed.resolverDefinitions[0]

		expect(resolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'cosmos',
				reference: 'cosmoshub-4',
			},
		})).toBe(true)
		expect(resolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		})).toBe(true)
		expect(resolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		})).toBe(false)
		expect(resolver.appliesTo('Slug', { slug: 'anything' })).toBe(true)
		expect(indexed.resolverValuePartsByEntityTypeSelectorAndFieldName[
			resolverPartsKey('FixtureNetwork', 'Caip2', [], 'name')
		]).toHaveLength(1)
		expect(indexed.resolverValuePartsByEntityTypeSelectorAndFieldName[
			resolverPartsKey('FixtureNetwork', 'Slug', [], 'description')
		]).toHaveLength(1)
		expect(indexed.resolverValuePartsByEntityTypeSelectorAndFieldName[
			resolverPartsKey('FixtureNetwork', 'Caip2', [], 'description')
		]).toBeUndefined()
		expect(indexed.resolverParts[0].resolver).toBe(resolver)
		expect('appliesTo' in indexed.resolverParts[0]).toBe(false)
	})

	it.each([
		[
			'unknown selector',
			{
				Missing: {
					appliesTo: [{ slug: 'cosmos' }],
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/unknown selector Missing/,
		],
		[
			'unknown selector field',
			{
				Slug: {
					appliesTo: [{ missing: 'cosmos' }],
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/Slug.*unknown pattern field missing/,
		],
		[
			'invalid literal',
			{
				Caip2: {
					appliesTo: [{ caip2: { namespace: 'solana' } }],
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/Caip2.*invalid pattern value/,
		],
		[
			'empty pattern set',
			{
				Slug: {
					appliesTo: [],
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/Slug.*applicability.*empty/,
		],
		[
			'non-array pattern set',
			{
				Slug: {
					appliesTo: {
						slug: 'cosmos',
					},
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/Slug.*forbidden applicability set/,
		],
		[
			'forbidden array pattern',
			{
				Caip2: {
					appliesTo: [{ caip2: [] }],
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			/Caip2.*forbidden pattern/,
		],
	])('rejects malformed unchecked declarations: %s', (_label, resolve, message) => {
		expect(() => validateResolverDefinitions(fixtureSchema, [{
			definitionIndex: 0,
			source: 'Fixture',
			entityType: 'FixtureNetwork',
			resolve,
			projections: {
				name: () => 'Invalid',
			},
		}] as SourceResolverDefinitionCandidate<typeof fixtureSchema, 'Fixture'>[])).toThrow(message)
	})

	it('rejects parent selector indexes without a matching resolver snapshot', () => {
		expect(() => validateResolverDefinitions(fixtureSchema, [{
			definitionIndex: 0,
			source: 'Fixture',
			entityType: 'FixtureNetwork',
			resolve: {
				Caip2: {
					resolve: async () => ({ description: 'Invalid' }),
				},
			},
			projections: {
				description: {
					parentSelectors: ['Slug'],
					select: (snapshot) => snapshot.description,
				},
			},
		}] as SourceResolverDefinitionCandidate<typeof fixtureSchema, 'Fixture'>[])).toThrow(
			/description.*unresolved parent selector Slug/
		)
	})

	it.each([
		[
			'missing start',
			{
				facetPath: [],
				publishes: { name: true },
			},
			/no live start function/,
		],
		[
			'empty publishes',
			{
				facetPath: [],
				publishes: {},
				start: () => {},
			},
			/malformed live publishes set/,
		],
		[
			'malformed facet path',
			{
				facetPath: ['Details', 1],
				publishes: { name: true },
				start: () => {},
			},
			/malformed live facet path/,
		],
		[
			'unknown property',
			{
				facetPath: [],
				publishes: { name: true },
				start: () => {},
				legacy: true,
			},
			/unknown live publisher property/,
		],
	])('rejects malformed unchecked live declarations: %s', (_label, publisher, message) => {
		expect(() => validateResolverDefinitions(fixtureSchema, [{
			definitionIndex: 0,
			source: 'Fixture',
			entityType: 'FixtureNetwork',
			resolve: {
				Slug: {
					resolve: async () => ({ name: 'Invalid' }),
				},
			},
			projections: {
				name: () => 'Invalid',
			},
			resolveLive: {
				name: publisher,
			},
		}] as SourceResolverDefinitionCandidate<typeof fixtureSchema, 'Fixture'>[])).toThrow(message)
	})
})
