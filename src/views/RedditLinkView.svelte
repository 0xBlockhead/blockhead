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
	}: EntitySelectionViewProps<EntityType.RedditLink> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditLink = $derived(viewSelection({
		fields: {
			title: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.title ?? '') || (pendingEntity.fullname ?? '') || 'Reddit submission')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLink_TimestampsView from '$/views/RedditLink_TimestampsView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
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
		<ResourceBoundary resource={redditLink}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditLink}>
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
				<dt>Submission ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.fullname} />
				</dd>
			</div>

			<ResourceBoundary
				resource={redditLink}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>Title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								selftext: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const selftext = entity.selftext}
						{#if selftext != null}
							<div>
								<dt>Body</dt>
								<dd>
									<span data-text="long-text">{selftext}</span>
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={redditLink}
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
					resource={selection.$subreddit}
				>
					{#snippet children(redditSubreddit)}
						{#if redditSubreddit != null}
							<div>
								<dt>Subreddit</dt>
								<dd>
									<RedditSubredditView
										selection={select(EntityType.RedditSubreddit, redditSubreddit[EntityMetaKey.Selector])}
										prefetched={redditSubreddit}
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
					resource={
						viewSelection({
							fields: {
								url: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const url = entity.url}
						{#if url != null}
							<div>
								<dt>URL</dt>
								<dd>
									<a
										href={String(url)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(url)} />
									</a>
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
								permalink: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const permalink = entity.permalink}
						{#if permalink != null}
							<div>
								<dt>Reddit permalink</dt>
								<dd>
									<a
										href={String(permalink)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(permalink)} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const redditLinkRedditCommentsViewCommentsResource = selection.$$comments}
		<ResourceBoundary
			resource={redditLinkRedditCommentsViewCommentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditCommentsView
						selection={redditLinkRedditCommentsViewCommentsResource}
						countResource={redditLinkRedditCommentsViewCommentsResource.count}
						title='Comments'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
								{
									fullname: encodeURIComponent(String(selection.entitySelector.fullname)),
								}
							)
						}
						id='comments'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const redditLinkRedditLinkTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={redditLinkRedditLinkTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditLink_TimestampsView
						selection={redditLinkRedditLinkTimestampsViewTimestampsResource}
						countResource={redditLinkRedditLinkTimestampsViewTimestampsResource.count}
						title='Observations'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
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
