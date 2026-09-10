import { expect, it } from 'vitest'
import { stringify } from 'devalue'
import {
	deleteLocalRssSubscription,
	type LocalMutationContext,
	writeLocalRssSubscription,
} from '$/collections/localMutations.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

type MockRow = Record<string, object | string | number | boolean | bigint | undefined>

const createContext = () => {
	const collectionByAddress = new Map<string, {
		toArray: MockRow[]
		startSyncImmediate(): void
		utils: {
			waitForPersistence(): Promise<void>
			replaceRows(predicate: (row: MockRow) => boolean, rows: readonly MockRow[]): void
			replaceRowsWithAuthority(
				predicate: (row: MockRow) => boolean,
				rows: readonly MockRow[],
				selectorKey: string,
				authorityKey: string,
				resolution: 'present' | 'resolved' | 'deleted',
				onApplied?: () => void | Promise<void>
			): Promise<void>
			writeUpsert(row: MockRow | readonly MockRow[]): void
			writeUpsertWithAuthority(
				row: MockRow | readonly MockRow[],
				selectorKey: string,
				authorityKey: string,
				resolution: 'present' | 'resolved' | 'deleted',
				onApplied?: () => void | Promise<void>
			): Promise<void>
		}
	}>()
	const collectionFor = (address: string) => {
		const existing = collectionByAddress.get(address)
		if (existing != null)
			return existing
		const rows: MockRow[] = []
		const collection = {
			toArray: rows,
			startSyncImmediate: () => {},
			utils: {
				waitForPersistence: async () => {},
				replaceRows: (predicate: (row: MockRow) => boolean, nextRows: readonly MockRow[]) => {
					for (let index = rows.length - 1; index >= 0; index--)
						if (predicate(rows[index]))
							rows.splice(index, 1)
					rows.push(...nextRows)
				},
				replaceRowsWithAuthority: (
					predicate: (row: MockRow) => boolean,
					nextRows: readonly MockRow[],
					_selectorKey: string,
					_authorityKey: string,
					_resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				) => {
					collection.utils.replaceRows(predicate, nextRows)
					return Promise.resolve(onApplied?.()).then(() => {})
				},
				writeUpsert: (row: MockRow | readonly MockRow[]) => {
					for (const nextRow of Array.isArray(row) ? row : [row]) {
						const index = rows.findIndex((existingRow) => (
							existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
							&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
							&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
							&& existingRow.valueKey === nextRow.valueKey
						))
						if (index >= 0)
							rows.splice(index, 1)
						rows.push(nextRow)
					}
				},
				writeUpsertWithAuthority: (
					row: MockRow | readonly MockRow[],
					_selectorKey: string,
					_authorityKey: string,
					_resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				) => {
					collection.utils.writeUpsert(row)
					return Promise.resolve(onApplied?.()).then(() => {})
				},
			},
		}
		collectionByAddress.set(address, collection)
		return collection
	}
	const context: LocalMutationContext = {
		entityCollections: new Proxy({}, {
			get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
		}),
		entityFieldCollections: new Proxy({}, {
			get: (_target, entityType: string) => new Proxy({}, {
				get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
			}),
		}),
		entityFieldCountCollections: new Proxy({}, {
			get: (_target, entityType: string) => new Proxy({}, {
				get: (_fields, fieldAddress: string) => collectionFor(`count:${entityType}:${fieldAddress}`),
			}),
		}),
	}
	return context
}

it('persists one normalized feed relationship and removes it with its local fields', async () => {
	const context = createContext()
	const subscription = await writeLocalRssSubscription(context, {
		feedUrl: ' https://example.com/feed.xml ',
		title: ' Example feed ',
	})
	await writeLocalRssSubscription(context, {
		feedUrl: 'https://example.com/feed.xml',
		title: 'Example feed',
	})

	expect(subscription).toEqual({ feedUrl: 'https://example.com/feed.xml' })
	expect(context.entityCollections[EntityType.RssFeed].toArray).toHaveLength(1)
	expect(context.entityFieldCollections[EntityType.RssFeed][entityFieldAddressKey(
		EntityType.RssFeed,
		[],
		'title'
	)].toArray).toEqual([
		expect.objectContaining({
			[EntityMetaKey.Value]: 'Example feed',
		}),
	])
	expect(context.entityFieldCollections[EntityType.RssNetwork][entityFieldAddressKey(
		EntityType.RssNetwork,
		[],
		'$$rssFeeds'
	)].toArray).toHaveLength(1)
	expect(context.entityFieldCountCollections[EntityType.RssNetwork][entityFieldAddressKey(
		EntityType.RssNetwork,
		[],
		'$$rssFeeds'
	)]?.toArray).toEqual([
		expect.objectContaining({
			[EntityMetaKey.Value]: 1,
			filterKey: stringify({}),
		}),
	])

	await deleteLocalRssSubscription(context, subscription.feedUrl)

	expect(context.entityCollections[EntityType.RssFeed].toArray).toHaveLength(0)
	expect(context.entityFieldCollections[EntityType.RssNetwork][entityFieldAddressKey(
		EntityType.RssNetwork,
		[],
		'$$rssFeeds'
	)].toArray).toHaveLength(0)
	expect(context.entityFieldCountCollections[EntityType.RssNetwork][entityFieldAddressKey(
		EntityType.RssNetwork,
		[],
		'$$rssFeeds'
	)]?.toArray).toEqual([
		expect.objectContaining({
			[EntityMetaKey.Value]: 0,
			filterKey: stringify({}),
		}),
	])
})
