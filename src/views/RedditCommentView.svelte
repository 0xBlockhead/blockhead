<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	}))
	const redditComment = $derived(viewSelection({
		fields: {
			body: true,
			createdAt: true,
		},
	}))


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
	title={title ?? ((prefetched.body ?? '') || selection.entitySelector.fullname || 'Reddit comment')}
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
				{/if}
			{/snippet}
		</ResourceBoundary>
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
			<div>
				<dt>Comment ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.fullname} />
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
									<Timestamp timestamp={createdAt} />
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
							{@const redditLinkInitial = untrack(() => redditLink)}
							<div>
								<dt>Submission</dt>
								<dd>
									<RedditLinkView
										selection={select(EntityType.RedditLink, (redditLink ?? redditLinkInitial)[EntityMetaKey.Selector])}
										prefetched={redditLink ?? redditLinkInitial}
										layout={EntityLayout.Value}
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
							{@const redditCommentInitial = untrack(() => redditComment)}
							<div>
								<dt>Reply to</dt>
								<dd>
									<RedditCommentView
										selection={select(EntityType.RedditComment, (redditComment ?? redditCommentInitial)[EntityMetaKey.Selector])}
										prefetched={redditComment ?? redditCommentInitial}
										layout={EntityLayout.Value}
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

	{#snippet Details()}
		{@const repliesResource = selection.$$replies}
		<ResourceBoundary
			resource={repliesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditCommentsView
						selection={repliesResource}
						countResource={repliesResource.count}
						title='Replies'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
								{
									fullname: encodeURIComponent(selection.entitySelector.fullname),
								}
							)
						}
						id='replies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RedditComment_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						href={
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
								{
									fullname: encodeURIComponent(selection.entitySelector.fullname),
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
