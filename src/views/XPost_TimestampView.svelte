<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.XPost_Timestamp>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntityView
	entityType={EntityType.XPost_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'X post observation'}
	href={
		href === undefined ?
			resolve(
				'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					postId: selection.entitySelector.$post.id,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<XPostView
			selection={select(EntityType.XPost, selection.entitySelector.$post)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Post</dt>
				<dd>
					<XPostView
						selection={select(EntityType.XPost, selection.entitySelector.$post)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							retweetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const retweetCount = entity.retweetCount}
					{#if retweetCount != null}
						<div>
							<dt>Retweets</dt>
							<dd>
								<NumberValue
									value={retweetCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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
		</dl>

		<dl data-column-item="center">
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
