import {
	afterEach,
	expect,
	it,
	vi,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'
import { stringify } from 'devalue'
import { client } from '$/client/$client.svelte.ts'
import {
	subscribeEntity,
	subscribeEntityField,
	subscribeEntityFieldCount,
} from '$/client/$subscribe.svelte.ts'
import { EntityMetaKey, entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { materializationFixtureSchema } from './client-materialization.fixture.ts'

const materializationParentSelector = { slug: 'parent' }
const testSourceIndex = <const _Source extends string>(sources: readonly _Source[]) => ({
	enabledBindingIds: new Set<string>(),
	enabledSources: new Set(sources),
	resolverPublicEnvBySource: new Map(sources.map((source) => [source, {}])),
})
const destroyResourceFailureContexts: (() => void)[] = []

afterEach(() => {
	for (const destroy of destroyResourceFailureContexts.splice(0))
		destroy()
})

const createResourceFailureContext = (
	resolve: () => Promise<bigint>
) => {
	const context = client({
		schema: materializationFixtureSchema,
		sourceProviders: [{
			provider: 'materialization-provider',
			label: 'Materialization provider',
			sources: {
				'source-a': {
					label: 'Source A',
				},
			},
			bindings: {},
		}],
	})({
		resolvers: [{
			source: 'source-a',
			resolvers: [{
				entityType: 'MaterializationParent',
				resolve: {
					Slug: {
						resolve,
					},
				},
				projections: {
					converted: () => 7n,
					values: {
						select: () => [1, 2],
						resolveCount: () => 2,
					},
				},
			}],
		}],
		sourceIndex: testSourceIndex(['source-a']),
	})({
		queryClient: new QueryClient(),
		persistence: {
			adapter: {
				loadSubset: async () => [],
				applyCommittedTx: async () => {},
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		},
		schemaVersion: 1,
	})
	destroyResourceFailureContexts.push(context.destroy)
	return context
}

it('keeps provider snapshots behind projections and resolves every embedded relationship row', async () => {
	const context = client({
		schema: materializationFixtureSchema,
		sourceProviders: [{
			provider: 'materialization-provider',
			label: 'Materialization provider',
			sources: {
				'source-a': {
					label: 'Source A',
				},
			},
			bindings: {},
		}],
	})({
		resolvers: [{
			source: 'source-a',
			resolvers: [{
				entityType: 'MaterializationParent',
				resolve: {
					Slug: {
						resolve: async () => ({
							converted: '7',
						}),
					},
				},
				projections: {
					converted: (snapshot) => BigInt(snapshot.converted),
					$$children: () => [
						{
							[EntityMetaKey.Selector]: {
								id: 'left',
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Left child',
								[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'left',
								[entityFieldAddressKey('MaterializationChild', [], '$sibling')]: {
									[EntityMetaKey.Selector]: {
										id: 'right',
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Right child',
										[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'right',
									},
								},
							},
						},
						{
							[EntityMetaKey.Selector]: {
								id: 'right',
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Right child',
								[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'right',
							},
						},
					],
				},
			}],
		}],
		sourceIndex: testSourceIndex(['source-a']),
	})({
		queryClient: new QueryClient(),
		persistence: {
			adapter: {
				loadSubset: async () => [],
				applyCommittedTx: async () => {},
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		},
		schemaVersion: 1,
	})
	const selection = context.select(
		'MaterializationParent',
		materializationParentSelector,
		{
			sources: ['source-a'],
		}
	)

	await selection
	await expect(selection.converted).resolves.toBe(7n)

	const children = selection.$$children({
		fields: {
			title: true,
			kind: true,
			$sibling: {
				fields: {
					title: true,
				},
			},
		},
	})
	await expect(children).resolves.toMatchObject({
		values: [
			{
				id: 'left',
				title: 'Left child',
				kind: 'left',
				$sibling: {
					title: 'Right child',
				},
				[EntityMetaKey.Source]: 'source-a',
			},
			{
				id: 'right',
				title: 'Right child',
				kind: 'right',
				[EntityMetaKey.Source]: 'source-a',
			},
		],
	})
	await expect.poll(() => children.current).toMatchObject({
		values: [
			{
				id: 'left',
				title: 'Left child',
				kind: 'left',
				[EntityMetaKey.Source]: 'source-a',
			},
			{
				id: 'right',
				title: 'Right child',
				kind: 'right',
				[EntityMetaKey.Source]: 'source-a',
			},
		],
	})
	const childTitleFieldAddressKey = entityFieldAddressKey('MaterializationChild', [], 'title')
	const leftChildSelectorKey = entitySelectorKey(
		materializationFixtureSchema,
		materializationFixtureSchema[1],
		{
			id: 'left',
		}
	)
	context.entityFieldCollections.MaterializationChild[childTitleFieldAddressKey].utils.replaceRows(
		(row) => (
			row[EntityMetaKey.ParentSelectorKey] === leftChildSelectorKey
			&& row[EntityMetaKey.Source] === 'source-a'
		),
		[{
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: 'title',
			[EntityMetaKey.ParentSelector]: {
				id: 'left',
			},
			[EntityMetaKey.ParentSelectorKey]: leftChildSelectorKey,
			[EntityMetaKey.Source]: 'source-a',
			[EntityMetaKey.Value]: 'Updated left child',
			valueKey: `Value:${stringify('Updated left child')}`,
		}]
	)
	await expect.poll(() => children.current).toMatchObject({
		values: [
			{
				id: 'left',
				title: 'Updated left child',
				kind: 'left',
			},
			{
				id: 'right',
				title: 'Right child',
				kind: 'right',
			},
		],
	})
})

it('shares one selector snapshot across entity and field materialization', async () => {
	const resolve = vi.fn(async () => 7n)
	const context = createResourceFailureContext(resolve)
	const entity = subscribeEntity(
		context,
		'MaterializationParent',
		materializationParentSelector,
		{
			fields: {
				converted: true,
				values: true,
			},
			sources: ['source-a'],
		}
	)
	const field = subscribeEntityField(
		context,
		'MaterializationParent',
		materializationParentSelector,
		'converted',
		{
			sources: ['source-a'],
		}
	)
	await Promise.all([
		entity,
		field,
	])
	expect(resolve).toHaveBeenCalledOnce()
})

it('retains current entity, field, and count values when their collection refresh fails', async () => {
	const context = createResourceFailureContext(async () => 7n)
	const entity = subscribeEntity(
		context,
		'MaterializationParent',
		materializationParentSelector,
		{
			fields: {
				converted: true,
			},
			sources: ['source-a'],
		}
	)
	const field = subscribeEntityField(
		context,
		'MaterializationParent',
		materializationParentSelector,
		'converted',
		{
			sources: ['source-a'],
		}
	)
	const count = subscribeEntityFieldCount(
		context,
		'MaterializationParent',
		materializationParentSelector,
		'values',
		{
			sources: ['source-a'],
		}
	)

	await expect(entity).resolves.toMatchObject({
		converted: 7n,
	})
	await expect(field).resolves.toBe(7n)
	await expect(count).resolves.toBe(2)

	const selectorKey = entitySelectorKey(
		materializationFixtureSchema,
		materializationFixtureSchema[0],
		materializationParentSelector
	)
	const addFailure = (
		collectionId: string,
		error: string,
		selectorKeys: readonly string[] = [],
		parentSelectorKeys: readonly string[] = [selectorKey]
	) => context.collectionLoadFailures.add({
		collectionId,
		selectorKeys,
		parentSelectorKeys,
		sources: ['source-a'],
		error,
	})
	const entityCollectionId = `client.entities.MaterializationParent`
	addFailure(
		entityCollectionId,
		'entity refresh failed',
		[selectorKey],
		[]
	)
	await vi.waitFor(() => {
		expect(entity.error).toMatchObject({ message: 'entity refresh failed' })
	})
	expect(entity.current).toMatchObject({ converted: 7n })
	expect(field.error).toBeUndefined()
	context.collectionLoadFailures.clear(entityCollectionId)
	await vi.waitFor(() => {
		expect(entity.error).toBeUndefined()
	})

	addFailure(
		stringify([
			'client.fields',
			'MaterializationParent',
			[],
			'converted',
		]),
		'field refresh failed'
	)
	addFailure(
		stringify([
			'client.counts',
			'MaterializationParent',
			[],
			'values',
		]),
		'count refresh failed'
	)

	await vi.waitFor(() => {
		expect(field.error).toMatchObject({ message: 'field refresh failed' })
		expect(entity.error).toMatchObject({ message: 'field refresh failed' })
		expect(count.error).toMatchObject({ message: 'count refresh failed' })
	})
	expect(field.current).toBe(7n)
	expect(entity.current).toMatchObject({ converted: 7n })
	expect(count.current).toBe(2)
})
