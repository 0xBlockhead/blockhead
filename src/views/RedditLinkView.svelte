<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditLink = $derived(viewSelection({
		fields: {
			title: true,
			selftext: true,
			author: true,
			createdAt: true,
			url: true,
			permalink: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || selection.entitySelector.fullname || 'Reddit submission')
	const viewDomId = $derived('reddit-link-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
				{
					fullname: encodeURIComponent(selection.entitySelector.fullname),
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
		<ResourceBoundary resource={redditLink}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.fullname} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditLink}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={redditLink}
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
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={redditLink}
				>
					{#snippet children(entity)}
						{@const url = entity.url}
						{#if url != null}
							<div>
								<dt>URL</dt>
								<dd>
									<a
										href={url}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={url} />
									</a>
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
						{@const permalink = entity.permalink}
						{#if permalink != null}
							<div>
								<dt>Reddit permalink</dt>
								<dd>
									<a
										href={permalink}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={permalink} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		{#if contentOpen}
			<ResourceBoundary
				resource={redditLink}
			>
				{#snippet children(entity)}
					{@const selftext = entity.selftext}
					{#if selftext != null && selftext !== ''}
						<p data-text="long-text">{selftext}</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-link-discussion'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-link-comments',
						label: 'Comments',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Discussion</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditLinkComments({ id, label })}
				<RedditCommentsView
					selection={selection.$$comments}
					countResource={selection.$$comments.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
							{
								fullname: encodeURIComponent(selection.entitySelector.fullname),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No comments on this submission yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-link-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-link-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditLinkTimestamps({ id, label })}
				<RedditLink_TimestampsView
					selection={selection.$$timestamps}
					countResource={selection.$$timestamps.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
							{
								fullname: encodeURIComponent(selection.entitySelector.fullname),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No submission observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
