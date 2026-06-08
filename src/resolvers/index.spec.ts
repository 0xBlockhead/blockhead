import { describe, expect, it } from 'vitest'

import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityFieldCardinality,
	entityFieldDefinitions,
	entityIdProjectionNameForId,
	entityIdProjectionNames,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'

import {
	fieldNamesWithLiveResolverByEntityType,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverDefinitions,
	resolverDiscriminatorPartsByEntityTypeAndConditionKey,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverPartsKey,
	resolverRootLivePartsByEntityType,
	resolverValuePartsByEntityTypeAndFieldName,
} from './index.ts'

const resolverParts = [
	...Object.values(resolverValuePartsByEntityTypeAndFieldName).flat(),
	...Object.values(resolverCountPartsByEntityTypeAndFieldName).flat(),
	...Object.values(resolverLivePartsByEntityTypeAndFieldName).flat(),
]

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


describe('resolver registry live resolver architecture', () => {
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
		expect(new Set(liveDefinitions.map((resolver) => resolver.definitionIndex)).size).toBe(
			liveDefinitions.length,
		)
		expect(liveDefinitions.every((resolver) => (
			resolverDefinitions[resolver.definitionIndex] === resolver
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
		const evmNetworkLiveParts = (
			resolverLivePartsByEntityTypeAndFieldName[
				resolverPartsKey(EntityType.EvmNetwork, 'blockHeight')
			] ?? []
		)
		const evmNetworkRootLiveParts = resolverRootLivePartsByEntityType[EntityType.EvmNetwork] ?? []

		expect(fieldNamesWithLiveResolverByEntityType[EntityType.EvmNetwork]).toContain('blockHeight')
		expect(evmNetworkRootLiveParts.some((resolver) => (
			resolver.resolveLive?.fields.includes('blockHeight')
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
				.flatMap((resolver) => (
					resolver.resolveLive?.fields.map((fieldName) => (
						resolverPartsKey(resolver.entityType, fieldName)
					)) ?? []
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
			resolverValuePartsByEntityTypeAndFieldName[
				resolverPartsKey(EntityType.EvmNetwork, 'blockHeight')
			]?.length,
		).toBeGreaterThan(0)
		expect(
			resolverCountPartsByEntityTypeAndFieldName[
				resolverPartsKey(EntityType.EvmNetwork, '$$blocks')
			]?.length,
		).toBeGreaterThan(0)
		expect(
			Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
				.flatMap((partsByConditionKey) => (
					Object.values(partsByConditionKey ?? {})
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
		const first = defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => ({}),
			},
			fields: {
				$$networks: {
					parentSelectors: [EntityIdProjection.Identity],
					select: () => ([]),
				},
			},
		})
		const second = defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => ({}),
			},
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
			(
				fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType]?.[resolverPart.fieldName]?.cardinality === EntityFieldCardinality.Many
				|| fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType]?.[resolverPart.fieldName]?.cardinality === EntityFieldCardinality.ZeroOrMany
			)
		))).toBe(true)
	})

	it('indexes conditional discriminator fields through the condition source field resolver parts', () => {
		const discriminatorEntries = Object.entries(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
			.flatMap(([entityType, partsByConditionKey]) => (
				Object.entries(partsByConditionKey ?? {}).map(([conditionKey, parts]) => ({
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
