<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import Boundary from '$/components/Boundary.svelte'
	import type { RemoteResource } from '@sveltejs/kit'
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
		resource: resourceRaw,
		boundaryKey = 'ResourceBoundary',
	}: {
		children: Snippet<[data: Data]>
		Pending?: Snippet
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
		placeholderText?: string
		resource:
			| QueryLike<Data>
			| RemoteResource<Data>
		boundaryKey?: string
	} = $props()


	const resource = (
		resourceRaw[Symbol.toStringTag] === 'RemoteResource' ?
			toQueryResourceFromRemote(() => resourceRaw as RemoteResource<Data>)
		:
			toQueryResource(() => resourceRaw as QueryLike<Data>)
	)
</script>


<Boundary {boundaryKey}>
	{#if resource.error !== undefined}
		{#if _Failed}
			{@render _Failed(
				resource.error,
				() => {},
			)}
		{:else}
			<div data-card>
				<p>{resource.error instanceof Error ? resource.error.message : String(resource.error)}</p>
			</div>
		{/if}
	{:else if !resource.ready}
		{#if _Pending}
			{@render _Pending()}
		{:else}
			<div
				data-card
				data-text="muted"
				class="loading"
			>
				<p>{typeof placeholderText === 'string' ? placeholderText : 'Loading…'}</p>
			</div>
		{/if}
	{:else}
		{@render children(resource.current as Data)}
	{/if}
</Boundary>


<style>
	.loading {
		cursor: wait;
	}
</style>
