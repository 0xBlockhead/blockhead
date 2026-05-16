<script module lang="ts">
	export enum Layout {
		Block = 'Block',
		Inline = 'Inline',
	}
</script>


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
		layout = Layout.Inline,
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
		layout?: Layout
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
		{:else if layout === Layout.Inline}
			<span
				data-badge
				class="inline-placeholder"
				aria-label={resource.error instanceof Error ? resource.error.message : String(resource.error)}
			>
				•••
			</span>
		{:else}
			<div data-card>
				<p>{resource.error instanceof Error ? resource.error.message : String(resource.error)}</p>
			</div>
		{/if}
	{:else if !resource.ready}
		{#if _Pending}
			{@render _Pending()}
		{:else}
			{#if layout === Layout.Inline}
				<span
					data-badge
					data-text="muted"
					class="loading inline-placeholder"
					aria-busy="true"
					aria-label={typeof placeholderText === 'string' ? placeholderText : 'Loading…'}
				>
					•••
				</span>
			{:else}
				<div
					data-card
					data-text="muted"
					class="loading"
				>
					<p>{typeof placeholderText === 'string' ? placeholderText : 'Loading…'}</p>
				</div>
			{/if}
		{/if}
	{:else}
		{@render children(resource.current as Data)}
	{/if}
</Boundary>


<style>
	.loading {
		cursor: wait;
	}

	.inline-placeholder {
		cursor: wait;
	}
</style>
