<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import type { QueryLike } from '$/lib/db/queryResource.svelte.ts'


	// Props
	let {
		children,
		Pending: _Pending,
		Failed: _Failed,
		placeholderText = 'Loading…',
		query,
	}: {
		children: Snippet<[data: Data]>
		Pending?: Snippet
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
		placeholderText?: string
		query: QueryLike<Data>
	} = $props()
</script>


{#if query.isReady && query.data !== undefined}
	{@render children(query.data)}
{:else if query.isError}
	{@const err = (query.error ?? query.status ?? 'Query failed')}
	{#if _Failed}
		{@render _Failed(err, () => {})}
	{:else}
		<div data-card>
			<p role="alert">{String(err)}</p>
		</div>
	{/if}
{:else if query.isLoading}
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
{/if}


<style>
	.loading {
		cursor: wait;
	}
</style>
