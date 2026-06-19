<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(x)/x/post/[postId]', {
			postId: selection.entitySelector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const post = $derived(
		selection(({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					postUrl: true,
				},
			}),
		)
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={post}
				placeholderText="Loading X post…"
			>
				{#snippet children(_post)}
					<TruncatedValue
						value={selection.entitySelector.id}
						format={TruncatedValueFormat.Visual}
					/>
				{/snippet}
			</ResourceBoundary>
		{:else}
			<TruncatedValue
				value={selection.entitySelector.id}
				format={TruncatedValueFormat.Visual}
			/>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Public posts on X (Twitter): short text, timestamps, and author profile links.
		</p>
		<p>
			Not Reddit threads, storage CIDs, on-chain receipts, or encrypted chats.
		</p>
	{/snippet}

	{#snippet Content({ open })}
		{#if open}
			<ResourceBoundary
				resource={post}
				placeholderText="Loading X post…"
			>
				{#snippet children(_post)}
					<p data-text="muted">
						Live post text is unavailable from the current public X source.
					</p>
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						{#if post.fields.postUrl}
							<div>
								<dt>Post URL</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={post.fields.postUrl}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

</EntityView>
