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
	error: unknown,
	retry: () => void,
)}
	{@const normalizedError = normalizeBoundaryError(error)}
	{#if Failed}
		{@render Failed(
			normalizedError,
			retry,
		)}
	{:else if layout === Layout.Inline}
		<span
			data-tag
			class="inline-placeholder"
			aria-label={normalizedError instanceof Error ? normalizedError.message : serializeError(normalizedError)}
		>
			•••
		</span>
	{:else}
		<div data-card>
			<p>{normalizedError instanceof Error ? normalizedError.message : serializeError(normalizedError)}</p>
		</div>
	{/if}
{/snippet}

<svelte:boundary
	onerror={(error: unknown) => {
		console.error('[blockhead:boundary:uncaught]', placeholderText, normalizeBoundaryError(error))
	}}
>
	{@render children(await resourceRaw)}

	{#snippet pending()}
		{@render PendingContent()}
	{/snippet}

	{#snippet failed(
		error: unknown,
		retry: () => void,
	)}
		{@render FailedContent(
			error,
			retry,
		)}
	{/snippet}
</svelte:boundary>


<style>
	.loading {
		cursor: wait;
	}

	.inline-placeholder {
		cursor: wait;
	}
</style>
