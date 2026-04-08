<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import Boundary from '$/components/Boundary.svelte'

	type QueryLike<Data> = {
		data: Data
		isLoading: boolean
		isError: boolean
		error?: unknown
	}


	// Props
	let {
		children,
		Failed,
		Pending: _Pending,
		placeholderText = 'Loading…',
		query,
	}: {
		children: Snippet<[data: Data]>
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
		Pending?: Snippet
		placeholderText?: string
		query: QueryLike<Data>
	} = $props()


	// (Derived)
	const dataPromise = $derived.by(() => (
		query.isLoading ?
			new Promise<Data>(() => {})
		: query.isError ?
			Promise.reject(
				query.error ?? new Error('Query failed'),
			)
		:
			query.data
	))
</script>


<Boundary
	{Failed}
>
	{#snippet Pending()}
		{#if _Pending}
			{@render _Pending()}
		{:else}
			<div
				data-card
				data-text="muted"
				class="loading"
			>
				<p>{placeholderText}</p>
			</div>
		{/if}
	{/snippet}

	{@render children(await dataPromise)}
</Boundary>


<style>
	.loading {
		cursor: wait;
	}
</style>
