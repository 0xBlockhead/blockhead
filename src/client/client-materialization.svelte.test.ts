import { expect, it } from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'
import { stringify } from 'devalue'
import { client } from '$/client/$client.svelte.ts'
import { EntityMetaKey, entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { materializationFixtureSchema } from './client-materialization.fixture.ts'

const materializationParentSelector = { slug: 'parent' }
const testSourceIndex = <const _Source extends string>(sources: readonly _Source[]) => ({
	enabledBindingIds: new Set<string>(),
	enabledSources: new Set(sources),
	resolverPublicEnvBySource: new Map(sources.map((source) => [source, {}])),
})

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
	const latestChild = selection.$$children({
		fields: { title: true },
		limit: 1,
		orderBy: [[[EntityMetaKey.Value, EntityMetaKey.Selector, 'id'], { direction: 'desc', nulls: 'last' }]],
	})
	await expect(latestChild).resolves.toMatchObject({
		values: [{ id: 'right', title: 'Right child' }],
	})
	expect(latestChild.current?.values).toHaveLength(1)
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
