import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'

export const inMemoryPersistence = () => {
	const collectionRowsByCollectionId = new Map<string, Map<string | number, object>>()
	const collectionMetadataByCollectionId = new Map<string, Map<string, string>>()

	return {
		collectionRowsByCollectionId,
		collectionMetadataByCollectionId,
		persistence: {
			adapter: {
				loadSubset: async (collectionId) => [
					...(collectionRowsByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({ key, value })),
				applyCommittedTx: async (collectionId, transaction) => {
					const collectionRows = collectionRowsByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.mutations) {
						if (mutation.type === 'delete')
							collectionRows.delete(mutation.key)
						else
							collectionRows.set(mutation.key, mutation.value)
					}
					collectionRowsByCollectionId.set(collectionId, collectionRows)
					const collectionMetadata = collectionMetadataByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.collectionMetadataMutations ?? []) {
						if (mutation.type === 'delete')
							collectionMetadata.delete(mutation.key)
						else
							collectionMetadata.set(mutation.key, JSON.stringify(mutation.value))
					}
					collectionMetadataByCollectionId.set(collectionId, collectionMetadata)
				},
				loadCollectionMetadata: async (collectionId) => [
					...(collectionMetadataByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({ key, value: JSON.parse(value) })),
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		},
	}
}
