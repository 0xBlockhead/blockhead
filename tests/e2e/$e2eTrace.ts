import type {
	ClientContext,
	ClientEvent,
	EntityCollectionItem,
	EntityFieldCollectionItem,
	EntityFieldCountCollectionItem,
} from '$/client/$client.svelte.ts'
import type { Schema } from '$/schema/$schema.ts'


export type E2ECollectionTrace = {
	collectionLoads: ClientEvent[]
	collectionRows: {
		entities: Record<string, EntityCollectionItem[]>
		fields: Record<string, Record<string, EntityFieldCollectionItem[]>>
		counts: Record<string, Record<string, EntityFieldCountCollectionItem[]>>
	}
}

export const traceE2ECollections = <
	const _Schema extends Schema,
	const _Source extends string
>(
	appClient: ClientContext<_Schema, _Source>
): E2ECollectionTrace => ({
	collectionLoads: appClient.events,
	collectionRows: {
		entities: Object.fromEntries(
			Object.entries(appClient.entityCollections).map(([entityType, collection]) => [
				entityType,
				collection.toArray,
			])
		),
		fields: Object.fromEntries(
			Object.entries(appClient.entityFieldCollections).map(([entityType, collections]) => [
				entityType,
				Object.fromEntries(
					Object.entries(collections).map(([fieldName, collection]) => [
						fieldName,
						collection.toArray,
					])
				),
			])
		),
		counts: Object.fromEntries(
			Object.entries(appClient.entityFieldCountCollections).map(([entityType, collections]) => [
				entityType,
				Object.fromEntries(
					Object.entries(collections).map(([fieldName, collection]) => [
						fieldName,
						collection?.toArray ?? [],
					])
				),
			])
		),
	},
})
