<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.RedditComment> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditComment = $derived(viewSelection({
		fields: {
			body: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.body ?? '') || (pendingEntity.fullname ?? '') || 'Reddit comment')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditComment_TimestampsView from '$/views/RedditComment_TimestampsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
			{
				fullname: encodeURIComponent(String(selection.entitySelector.fullname)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={redditComment}>
			{#snippet children(entity)}
				{@const body0 = entity.body}
				{#if body0 != null}
					<span data-text="long-text">{body0}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditComment}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Comment ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.fullname} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const author = entity.author}
					{#if author != null}
						<div>
							<dt>Author</dt>
							<dd>
								{author}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={redditComment}
				>
					{#snippet children(entity)}
						{@const createdAt = entity.createdAt}
						{#if createdAt != null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								depth: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const depth = entity.depth}
						{#if depth != null}
							<div>
								<dt>Depth</dt>
								<dd>
									{String(depth)}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$link}
				>
					{#snippet children(redditLink)}
						{#if redditLink != null}
							<div>
								<dt>Submission</dt>
								<dd>
									<RedditLinkView
										selection={select(EntityType.RedditLink, redditLink[EntityMetaKey.Selector])}
										prefetched={redditLink}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$parentComment}
				>
					{#snippet children(redditComment)}
						{#if redditComment != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<RedditCommentView
										selection={select(EntityType.RedditComment, redditComment[EntityMetaKey.Selector])}
										prefetched={redditComment}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<ResourceBoundary
			resource={redditComment}
		>
			{#snippet children(entity)}
				{@const body = entity.body}
				{#if body != null && body !== ''}
					<p data-text="long-text">{body}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const redditCommentRedditCommentsViewRepliesResource = selection.$$replies}
		<ResourceBoundary
			resource={redditCommentRedditCommentsViewRepliesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditCommentsView
						selection={redditCommentRedditCommentsViewRepliesResource}
						countResource={redditCommentRedditCommentsViewRepliesResource.count}
						title='Replies'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
								{
									fullname: encodeURIComponent(String(selection.entitySelector.fullname)),
								}
							)
						}
						id='replies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const redditCommentRedditCommentTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={redditCommentRedditCommentTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditComment_TimestampsView
						selection={redditCommentRedditCommentTimestampsViewTimestampsResource}
						countResource={redditCommentRedditCommentTimestampsViewTimestampsResource.count}
						title='Observations'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
								{
									fullname: encodeURIComponent(String(selection.entitySelector.fullname)),
								}
							)
						}
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
