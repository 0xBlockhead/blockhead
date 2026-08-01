<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AtprotoPost_Timestamp>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]',
				{
					uri: encodeURIComponent(selection.entitySelector.$post.uri),
					timestampMs: String(selection.entitySelector.timestampMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							likeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const likeCount = entity.likeCount}
					{#if likeCount != null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue
									value={likeCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							repostCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const repostCount = entity.repostCount}
					{#if repostCount != null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue
									value={repostCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const replyCount = entity.replyCount}
					{#if replyCount != null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue
									value={replyCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteCount = entity.quoteCount}
					{#if quoteCount != null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue
									value={quoteCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
