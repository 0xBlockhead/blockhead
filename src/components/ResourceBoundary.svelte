<script module lang="ts">
	export const Layout = {
		Block: 'Block',
		Inline: 'Inline',
	}

	type Layout = typeof Layout[keyof typeof Layout]
</script>


<script lang="ts" generics="
	Data
">
	// Types/constants
	import type { Snippet } from 'svelte'

	import {
		normalizeBoundaryError,
		serializeError,
	} from '$/lib/errors.ts'
	import {
		type QueryResourceError,
		type SvelteKitResource,
	} from '$/lib/db/queryResource.svelte.ts'


	// State
	let {
		children,
		Pending,
		Failed,
		placeholderText = 'Loading…',
		resource,
		layout = Layout.Inline,
	}: {
		children: Snippet<[data: Data]>
		Pending?: Snippet
		Failed?: Snippet<[
			error: QueryResourceError,
			retry: () => void,
		]>
		placeholderText?: string
		resource: SvelteKitResource<Data>
		layout?: Layout
	} = $props()


	// Components
	import Boundary from '$/components/Boundary.svelte'
</script>


{#snippet PendingContent()}
	{#if Pending}
		{@render Pending()}
	{:else if layout === Layout.Inline}
		<span
			data-tag
			data-text="muted"
			class="loading inline-placeholder"
			aria-busy="true"
			aria-label={placeholderText}
		>
			•••
		</span>
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

{#snippet FailedContent(
	error: QueryResourceError,
	retry: () => void,
)}
	{#if Failed}
		{@render Failed(
			error,
			retry,
		)}
	{:else if layout === Layout.Inline}
		<span
			data-tag
			class="inline-placeholder"
			aria-label={error instanceof Error ? error.message : serializeError(error)}
		>
			•••
		</span>
	{:else}
		<div data-card>
			<p>{error instanceof Error ? error.message : serializeError(error)}</p>
		</div>
	{/if}
{/snippet}

<Boundary boundaryKey={placeholderText}>
	{#if resource.error !== undefined}
		{@render FailedContent(
			resource.error,
			() => {},
		)}
	{:else if resource.ready && resource.current !== undefined}
		{@render children(resource.current)}
	{:else}
		{@render PendingContent()}
	{/if}

	{#snippet Pending()}
		{@render PendingContent()}
	{/snippet}

	{#snippet Failed(
		error,
		retry,
	)}
		{@render FailedContent(
			normalizeBoundaryError(error),
			retry,
		)}
	{/snippet}
</Boundary>


<style>
	.loading {
		cursor: wait;
	}

	.inline-placeholder {
		cursor: wait;
	}
</style>
