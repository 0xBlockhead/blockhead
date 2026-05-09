<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import Boundary from '$/components/Boundary.svelte'
	import type { RemoteResource } from '$/lib/svelte/RemoteResource.svelte.ts'
	import {
		type QueryLike,
		toQueryResource,
		toQueryResourceFromRemote,
	} from '$/lib/db/queryResource.svelte.ts'


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
		query:
			| QueryLike<Data>
			| RemoteResource<Data>
	} = $props()


	const resource = query[Symbol.toStringTag] === 'RemoteResource' ?
		toQueryResourceFromRemote(() => query as RemoteResource<Data>)
	:
		toQueryResource(() => query as QueryLike<Data>)
</script>


<Boundary>
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

	{#snippet Failed(error, retry)}
		{#if _Failed}
			{@render _Failed(error, retry)}
		{:else}
			<div data-card>
				<p>{String(error)}</p>
			</div>
		{/if}
	{/snippet}

	{@render children(await resource)}
</Boundary>


<style>
	.loading {
		cursor: wait;
	}
</style>
