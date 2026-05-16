<script module lang="ts">
	export enum Layout {
		Block = 'Block',
		Inline = 'Inline',
	}
</script>


<script lang="ts" generics="Data">
	// Types/constants
	import type { Snippet } from 'svelte'

	import { serializeError } from '$/lib/errors.ts'
	import type { QueryLike } from '$/lib/db/queryResource.svelte.ts'


	// Props
	let {
		children,
		Pending: _Pending,
		Failed: _Failed,
		placeholderText = 'Loading…',
		query,
		boundaryKey = 'QueryBoundary',
		layout = Layout.Inline,
	}: {
		children: Snippet<[data: Data]>
		Pending?: Snippet
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
		placeholderText?: string
		query: QueryLike<Data>
		boundaryKey?: string
		layout?: Layout
	} = $props()
</script>


{#if query.isReady && query.data !== undefined}
	{@render children(query.data)}
{:else if query.isError}
	{@const err = (query.error ?? query.status ?? 'Query failed')}
	{@const _ = (
		void console.error('[blockhead:boundary]', boundaryKey, err),
		true
	)}
	<div
		data-error={boundaryKey}
		role="alert"
	>
		{#if _Failed}
			{@render _Failed(err, () => {})}
		{:else if layout === Layout.Inline}
			<span
				data-badge
				class="inline-placeholder"
				aria-label={err instanceof Error ? err.message : serializeError(err)}
			>
				•••
			</span>
		{:else}
			<div data-card>
				<p>{err instanceof Error ? err.message : serializeError(err)}</p>
			</div>
		{/if}
	</div>
{:else if query.isLoading}
	{#if _Pending}
		{@render _Pending()}
	{:else if layout === Layout.Inline}
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


<style>
	.loading {
		cursor: wait;
	}

	.inline-placeholder {
		cursor: wait;
	}
</style>
