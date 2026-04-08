<script lang="ts" generics="T">
	// Types/constants
	import { createSubscriber } from 'svelte/reactivity'

	type InspectableCollection<_T> = {
		status: string
		entries: () => IterableIterator<[unknown, _T]>
		subscribeChanges: (
			_onChanges: (_changes: unknown[]) => void,
			_opts?: { includeInitialState?: boolean },
		) => { unsubscribe: () => void }
		onFirstReady: (_callback: () => void) => void
	}

	// Props

	let {
		collection,
		summaryLabel,
		summaryAsCode = false,
		summaryLevel,
		detailsClass,
		contentColumn = false,
		rowKey,
	}: {
		collection: InspectableCollection<T>
		summaryLabel: string
		summaryAsCode?: boolean
		summaryLevel: 'h3' | 'h4'
		detailsClass: string
		contentColumn?: boolean
		rowKey: (_row: T, _index: number) => string
	} = $props()

	// (Derived)

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
</script>


<details
	data-card
	class={detailsClass}
>
	<summary>
		<svelte:element this={summaryLevel === 'h3' ? 'h3' : 'h4'}>
			{#if summaryAsCode}
				<code>{summaryLabel}</code>
			{:else}
				{summaryLabel}
			{/if}
			({rows.length})
			·
			<code>{status}</code>
		</svelte:element>
	</summary>

	{#if contentColumn}
		<div data-column>
			{#if status === 'error'}
				<p>Error</p>
			{:else if rows.length}
				<ul class="collection-entity-fields">
					{#each rows as row, index (rowKey(row, index))}
						<li>
							<pre data-card>{JSON.stringify(
								row,
								(_key, inner) => (typeof inner === 'bigint' ? inner.toString() : inner),
								2,
							)}</pre>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No cached rows</p>
			{/if}
		</div>
	{:else if status === 'error'}
		<p>Error</p>
	{:else if rows.length}
		<ul class="collection-entities">
			{#each rows as row, index (rowKey(row, index))}
				<li>
					<pre data-card>{JSON.stringify(
						row,
						(_key, inner) => (typeof inner === 'bigint' ? inner.toString() : inner),
						2,
					)}</pre>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No cached rows</p>
	{/if}
</details>


<style>
	pre {
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.35;
		max-height: 80vh;
	}
</style>
