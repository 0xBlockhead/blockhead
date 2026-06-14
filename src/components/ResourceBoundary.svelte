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

	import { serializeError } from '$/lib/errors.ts'
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
		resource: resourceRaw,
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
</script>


{#if resourceRaw.error !== undefined}
	{@render FailedFallback(
		resourceRaw.error,
		() => {},
	)}
{:else if resourceRaw.current !== undefined}
	{@render children(resourceRaw.current)}
{:else}
	{@render PendingFallback()}
{/if}

{#snippet PendingFallback()}
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
{/snippet}

{#snippet FailedFallback(
	error,
	retry,
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


<style>
	.loading {
		cursor: wait;
	}

	.inline-placeholder {
		cursor: wait;
	}
</style>
