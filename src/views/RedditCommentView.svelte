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
	}: EntitySelectionViewProps<EntityType.RedditComment> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditComment = $derived(viewSelection({
		fields: {
			body: true,
			author: true,
			createdAt: true,
			depth: true,
		},
	}))
	const titleFallback = $derived((prefetched.body ?? '') || selection.entitySelector.fullname || 'Reddit comment')
	const viewDomId = $derived('reddit-comment-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
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
		<ResourceBoundary resource={redditComment}>
			{#snippet children(entity)}
				{@const body = entity.body}
				{#if body != null}
					<span data-text="long-text">{body}</span>
				{:else}
					{title || titleFallback}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.fullname} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditComment}>
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
				resource={redditComment}
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
						{@const depth = entity.depth}
						{#if depth != null}
							<div>
								<dt>Depth</dt>
								<dd>
									{depth}
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
										showTypeAnnotation={false}
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
					{#snippet children(parentComment)}
						{#if parentComment != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<RedditCommentView
										selection={select(EntityType.RedditComment, parentComment[EntityMetaKey.Selector])}
										prefetched={parentComment}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		{#if contentOpen}
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
		{/if}
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-comment-thread'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-comment-replies',
						label: 'Replies',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Thread</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditCommentReplies({ id, label })}
				<RedditCommentsView
					selection={selection.$$replies}
					countResource={selection.$$replies.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
							{
								fullname: encodeURIComponent(selection.entitySelector.fullname),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No replies to this comment yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-comment-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-comment-timestamps',
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

			{#snippet SectionRedditCommentTimestamps({ id, label })}
				<RedditComment_TimestampsView
					selection={selection.$$timestamps}
					countResource={selection.$$timestamps.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
							{
								fullname: encodeURIComponent(selection.entitySelector.fullname),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No comment observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
