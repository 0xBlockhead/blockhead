<script module lang="ts">
	export const Layout = {
		Block: 'Block',
		Inline: 'Inline',
	}

	type Layout = typeof Layout[keyof typeof Layout]
</script>


<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import Boundary from '$/components/Boundary.svelte'
	import {
		type QueryLike,
		type QueryResourceError,
		type RemoteResourceLike,
		toQueryResource,
		toQueryResourceFromRemote,
	} from '$/lib/db/queryResource.svelte.ts'


	// State
	let {
		children,
		Pending,
		Failed,
		placeholderText = 'Loading…',
		resource: resourceRaw,
		boundaryKey = 'ResourceBoundary',
		layout = Layout.Inline,
	}: {
		children: Snippet<[data: Data]>
		Pending?: Snippet
		Failed?: Snippet<[
			error: QueryResourceError,
			retry: () => void,
		]>
		placeholderText?: string
		resource:
			| QueryLike<Data>
			| RemoteResourceLike<Data>
		boundaryKey?: string
		layout?: Layout
	} = $props()

	const resource = $derived(
		'data' in resourceRaw ?
			toQueryResource(() => resourceRaw)
		:
			toQueryResourceFromRemote(() => resourceRaw)
	)
</script>


<Boundary {boundaryKey}>
	{@const current = resource.current}

	{#if resource.error !== undefined}
		{#if Failed}
			{@render Failed(
				resource.error,
				() => {},
			)}
		{:else if layout === Layout.Inline}
			<span
				data-tag
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
	{:else if current === undefined && !resource.ready}
		{#if Pending}
			{@render Pending()}
		{:else}
			{#if layout === Layout.Inline}
				<span
					data-tag
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
		{@render children(current as Data)}
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
