import { createSubscriber } from 'svelte/reactivity'

export type InspectableCollection<T> = {
	status: string
	entries: () => IterableIterator<[unknown, T]>
	subscribeChanges: (
		_onChanges: (_changes: unknown[]) => void,
		_opts?: { includeInitialState?: boolean },
	) => { unsubscribe: () => void }
	onFirstReady: (_callback: () => void) => void
}

export const useCollectionCache = <T,>(collection: InspectableCollection<T>) => {
	const subscribeToCollection = createSubscriber((update) => {
		collection.onFirstReady(update)
		const sub = collection.subscribeChanges(update, { includeInitialState: true })
		return () => {
			sub.unsubscribe()
		}
	})

	const status = $derived.by(() => {
		subscribeToCollection()
		return collection.status
	})

	const rows = $derived.by(() => {
		subscribeToCollection()
		return [...collection.entries()].map(([, value]) => value)
	})

	return {
		status,
		rows,
	}
}
