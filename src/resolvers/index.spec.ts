import { describe, expect, it } from 'vitest'
import { env as publicEnv } from '$env/dynamic/public'

import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	indexResolvers,
	validateResolverDefinitions,
	type SourceResolverDefinition,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityFieldCardinality,
	EntityFieldType,
	entityFieldDefinitions,
	entityIdProjectionNameForId,
	entityIdProjectionNames,
	type Schema,
} from '$/schema/$schema.ts'
import { type as arktype } from 'arktype'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { sourceProviders } from '$/sources/index.ts'
import { resolvers } from '$/resolvers/index.ts'

const {
	resolverDefinitions,
	resolverParts,
	resolverValuePartsByEntityTypeAndFieldName,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	fieldNamesWithLiveResolverByEntityType,
	resolverDiscriminatorPartsByEntityTypeAndConditionKey,
} = indexResolvers(
	schema,
	resolvers,
	indexSourceProviders(sourceProviders, publicEnv).enabledSources,
)

const fieldDefinitionByEntityTypeAndFieldName = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(
			entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			]),
		),
	]),
)

const entityDefinitionFor = (
	entityType: EntityType,
) => {
	const entityDefinition = schema.find((candidate) => candidate.entityType === entityType)
	if (entityDefinition == null)
		throw new Error(`Missing schema entity definition for ${entityType}`)

	return entityDefinition
}

const fixtureSchema = [
	{
		entityType: 'FixtureEntity',
		label: 'Fixture entity',
		labelPlural: 'Fixture entities',
		id: arktype({
			id: 'string',
		}),
		identities: [
			{
				name: 'slug',
				fields: ['slug'],
			},
		],
		fields: [
			{
				name: 'name',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string'),
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: '$$children',
				type: EntityFieldType.EntitiesReference,
				entityType: 'FixtureEntity',
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		],
	},
] as const satisfies Schema

const validFixtureResolver = {
	definitionIndex: 0,
	source: 'Fixture',
	entityType: 'FixtureEntity',
	resolve: {
		[EntityIdProjection.Identity]: async () => ({}),
	},
	fields: {
		name: () => 'Ada',
	},
} satisfies SourceResolverDefinition<Schema, 'Fixture'>


describe('resolver registry live resolver architecture', () => {
	it('rejects invalid resolver definitions before runtime reads', () => {
		for (const [label, resolver, message] of [
			[
				'unknown entity',
				{
					...validFixtureResolver,
					entityType: 'MissingEntity',
				},
				/references unknown entity/,
			],
			[
				'unknown projection',
				{
					...validFixtureResolver,
					resolve: {
						missingProjection: async () => ({}),
					},
				},
				/references unknown id projection missingProjection/,
			],
			[
				'unknown field',
				{
					...validFixtureResolver,
					fields: {
						missingField: () => undefined,
					},
				},
				/references unknown field missingField/,
			],
			[
				'unknown parent projection',
				{
					...validFixtureResolver,
					fields: {
						$$children: {
							parentSelectors: ['missingProjection'],
							select: () => [],
						},
					},
				},
				/references unknown parent id projection missingProjection/,
			],
			[
				'count on scalar field',
				{
					...validFixtureResolver,
					fields: {
						name: {
							resolveCount: () => 1,
						},
					},
				},
				/has resolveCount but is not multiple-cardinality/,
			],
			[
				'unknown root live field',
				{
					...validFixtureResolver,
					resolveLive: {
						clock: {
							publishes: {
								missingField: true,
							},
							start: () => {},
						},
					},
				},
				/references unknown live field missingField/,
			],
			[
				'async field selector',
				{
					...validFixtureResolver,
					fields: {
						name: async () => 'Ada',
					},
				},
				/has async field selector/,
			],
			[
				'async count selector',
				{
					...validFixtureResolver,
					fields: {
						$$children: {
							resolveCount: async () => 1,
						},
					},
				},
				/has async count selector/,
			],
		] satisfies readonly (readonly [
			label: string,
			resolver: SourceResolverDefinition<Schema, 'Fixture'>,
			message: RegExp,
		])[]) {
			expect(
				() => validateResolverDefinitions(fixtureSchema, [resolver]),
				label,
			).toThrow(message)
		}
	})

	it('keeps live resolver identity out of declarative resolver definitions', () => {
		expect(
			resolverDefinitions.some((resolver) => (
				'id' in resolver
			)),
		).toBe(false)
	})

	it('indexes live definitions by materialized position instead of source/entity/field identity', () => {
		const liveDefinitions = Object.values(resolverRootLivePartsByEntityType).flat()

		expect(liveDefinitions.length).toBeGreaterThan(0)
			expect(new Set(liveDefinitions.map((part) => part.resolver.definitionIndex)).size).toBe(
				liveDefinitions.length,
			)
			expect(liveDefinitions.every((part) => (
				resolverDefinitions[part.resolver.definitionIndex] === part.resolver
			))).toBe(true)
	})

	it('keeps resolver parts anchored to materialized resolver and field positions', () => {
		expect(resolverParts.length).toBeGreaterThan(0)
		expect(resolverParts.every((resolverPart) => (
			resolverDefinitions[resolverPart.resolver.definitionIndex] === resolverPart.resolver
			&& Object.entries(resolverPart.resolver.fields)[resolverPart.partIndex]?.[0] === resolverPart.fieldName
		))).toBe(true)
		expect(
			resolverParts.some((resolverPart, resolverPartIndex) => (
				resolverParts.some((otherResolverPart, otherResolverPartIndex) => (
					otherResolverPartIndex !== resolverPartIndex
					&& otherResolverPart.source === resolverPart.source
					&& otherResolverPart.entityType === resolverPart.entityType
					&& otherResolverPart.fieldName === resolverPart.fieldName
					&& (
						otherResolverPart.resolver.definitionIndex !== resolverPart.resolver.definitionIndex
						|| otherResolverPart.partIndex !== resolverPart.partIndex
					)
				))
			)),
		).toBe(true)
	})

	it('exposes Voltaire blockstream as an EvmNetwork live resolver through field parts and root fields', () => {
		const evmNetworkLiveParts = resolverParts.filter((part) => (
			part.entityType === EntityType.EvmNetwork
			&& part.fieldName === 'blockHeight'
			&& part.resolveLive != null
		))
		const evmNetworkRootLiveParts = resolverRootLivePartsByEntityType[EntityType.EvmNetwork] ?? []

		expect(fieldNamesWithLiveResolverByEntityType[EntityType.EvmNetwork]).toContain('blockHeight')
			expect(evmNetworkRootLiveParts.some((part) => (
				part.publisher.publishes.blockHeight === true
			))).toBe(true)
		expect(evmNetworkLiveParts.every((resolverPart) => (
			resolverDefinitions[resolverPart.resolver.definitionIndex] === resolverPart.resolver
			&& Object.values(resolverPart.resolver.fields)[resolverPart.partIndex] != null
		))).toBe(true)
	})

	it('keeps root and field live resolver indexes distinct', () => {
		const rootLiveFields = new Set(
			Object.values(resolverRootLivePartsByEntityType)
				.flat()
					.flatMap((part) => (
						Object.keys(part.publisher.publishes).map((fieldName) => ({
							entityType: part.entityType,
							fieldName,
						}))
					)),
		)
		expect(rootLiveFields.size).toBeGreaterThan(0)
		expect(Object.values(resolverRootLivePartsByEntityType).flat().every((resolver) => (
			'partIndex' in resolver
		))).toBe(false)
		expect(Object.values(resolverLivePartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			'partIndex' in resolverPart
		))).toBe(true)
		expect(fieldNamesWithLiveResolverByEntityType[EntityType.EvmNetwork]).toContain('blockHeight')
	})

	it('indexes value, count, and discriminator resolver parts without resolver ids', () => {
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.EvmNetwork
				&& part.fieldName === 'blockHeight'
				&& part.select != null
			)).length,
		).toBeGreaterThan(0)
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.EvmNetwork
				&& part.fieldName === '$$blocks'
				&& part.resolveCount != null
			)).length,
		).toBeGreaterThan(0)
		expect(
			Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
				.flatMap((partsByConditionKey) => (
					Object.values(partsByConditionKey)
				))
				.some((parts) => parts.length > 0),
		).toBe(true)
		expect(
			Object.values(resolverValuePartsByEntityTypeAndFieldName)
				.flat()
				.some((resolverPart) => (
					'id' in resolverPart
					|| 'id' in resolverPart.resolver
				)),
		).toBe(false)
	})

	it('preserves duplicate-safe field part indexes for multi-projection resolve keys and parentSelectors parts', () => {
		const first = defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => ({}),
			},
		})({
			fields: {
				$$networks: {
					parentSelectors: [EntityIdProjection.Identity],
					select: () => ([]),
				},
			},
		})
		const second = defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => ({}),
			},
		})({
			fields: {
				$$networks: {
					parentSelectors: [EntityIdProjection.Identity],
					select: () => ([]),
				},
			},
		})
		const parts = [first, second].flatMap((resolver, definitionIndex) => (
			Object.entries(resolver.fields).map(([fieldName, fieldSelector], partIndex) => ({
				...(typeof fieldSelector === 'function' ? { select: fieldSelector } : fieldSelector),
				definitionIndex,
				partIndex,
				source: Source.Constants_Internal,
				entityType: resolver.entityType,
				fieldName,
				resolveProjectionNames: Object.keys(resolver.resolve),
			}))
		))

		expect(parts).toEqual([
			expect.objectContaining({
				definitionIndex: 0,
				partIndex: 0,
				resolveProjectionNames: [EntityIdProjection.Identity],
				parentSelectors: [EntityIdProjection.Identity],
			}),
			expect.objectContaining({
				definitionIndex: 1,
				partIndex: 0,
				resolveProjectionNames: [EntityIdProjection.Identity],
				parentSelectors: [EntityIdProjection.Identity],
			}),
		])
		expect(new Set(parts.map((part) => (
			`${part.source}:${part.entityType}:${part.fieldName}`
		))).size).toBe(1)
		expect(new Set(parts.map((part) => (
			`${part.definitionIndex}:${part.partIndex}`
		))).size).toBe(parts.length)
	})

	it('limits resolver id matching to schema projection names', () => {
		const entityIdProjectionNamesByEntityType = Object.fromEntries(
			schema.map((entityDefinition) => [
				entityDefinition.entityType,
				new Set(entityIdProjectionNames(entityDefinition)),
			]),
		)

		expect(resolverDefinitions.every((resolver) => (
			Object.keys(resolver.resolve).every((projectionName) => (
				entityIdProjectionNamesByEntityType[resolver.entityType]?.has(projectionName)
			))
		))).toBe(true)
		expect(Object.values(resolverValuePartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			(resolverPart.parentSelectors ?? []).every((acceptedProjectionName) => (
				entityIdProjectionNamesByEntityType[resolverPart.entityType]?.has(acceptedProjectionName)
			))
		))).toBe(true)
		expect(resolverDefinitions.some((resolver) => (
			Object.keys(resolver.resolve).includes('acct')
			|| Object.keys(resolver.resolve).includes('usernameHashPrefix')
			|| Object.keys(resolver.resolve).includes('localName')
		))).toBe(true)
	})

	it('distinguishes concrete multi-id projections instead of grouping lookup ids', () => {
		expect(entityIdProjectionNameForId(
			entityDefinitionFor(EntityType.FarcasterCast),
			{
				fid: 1,
				hash: '0x1234',
			},
		)).toBe('fidHash')
		expect(entityIdProjectionNameForId(
			entityDefinitionFor(EntityType.FarcasterCast),
			{
				username: 'alice',
				hashPrefix: '0x1234',
			},
		)).toBe('usernameHashPrefix')
		expect(entityIdProjectionNameForId(
			entityDefinitionFor(EntityType.FarcasterCast),
			{
				clientUrl: 'https://warpcast.com/alice/0x1234',
			},
		)).toBe('clientUrl')
		expect(entityIdProjectionNameForId(
			entityDefinitionFor(EntityType.LensAccount),
			{
				localName: 'Alice',
			},
		)).toBe('localName')
		expect(entityIdProjectionNameForId(
			entityDefinitionFor(EntityType.LensAccount),
			{
				legacyProfileId: '0x01',
			},
		)).toBe('legacyProfileId')
	})

	it('only indexes count facets for multiple-cardinality fields', () => {
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().length).toBeGreaterThan(0)
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.Many
			|| fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.ZeroOrMany
		))).toBe(true)
	})

	it('indexes conditional discriminator fields through the condition source field resolver parts', () => {
		const discriminatorEntries = Object.entries(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
			.flatMap(([entityType, partsByConditionKey]) => (
				Object.entries(partsByConditionKey).map(([conditionKey, parts]) => ({
					entityType,
					conditionKey,
					parts,
				}))
			))

		expect(discriminatorEntries.length).toBeGreaterThan(0)
		expect(discriminatorEntries.some(({ conditionKey, parts }) => (
			conditionKey.includes('[')
			&& parts.length > 0
		))).toBe(true)
		expect(discriminatorEntries.every(({ entityType, conditionKey, parts }) => (
			parts.every((resolverPart) => (
				resolverPart.entityType === entityType
				&& conditionKey.startsWith(resolverPart.fieldName)
			))
		))).toBe(true)
	})
})
