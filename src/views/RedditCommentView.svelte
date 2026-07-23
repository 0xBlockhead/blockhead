<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.RedditComment>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.RedditComment>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const redditComment = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			body: true,
			createdAt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			body: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.body) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment')
	const viewDomId = $derived('reddit-comment-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'fullname' in selection.entitySelector
			&& selection.entitySelector.fullname != null ?
				resolve('/reddit/comment/[fullname=stringSegment]', {
			fullname: encodeURIComponent(String(selection.entitySelector.fullname ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'body') && Object.hasOwn(prefetched, 'createdAt')}
			{@const body0 = pendingEntity.body}
			{#if body0 !== undefined && body0 !== null}
				<span data-text="long-text">{String((body0) ?? '')}</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditComment}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const body0 = resolvedEntity.body}
					{#if body0 !== undefined && body0 !== null}
						<span data-text="long-text">{String((body0) ?? '')}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'body') && Object.hasOwn(prefetched, 'createdAt')}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditComment}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Comment ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									fullname: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fullname = resolvedEntity.fullname}
							{#if fullname !== undefined && fullname !== null}
								<TruncatedValue value={String((fullname) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const author = resolvedEntity.author}
					{#if author !== undefined && author !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((author) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const createdAt = resolvedEntity.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
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
						selection({
							sources: selection.sources,
							fields: {
								depth: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const depth = resolvedEntity.depth}
						{#if depth !== undefined && depth !== null}
							<div>
								<dt>Depth</dt>
								<dd>
									{String((depth) ?? '')}
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
						{#if redditLink != null && redditLink[EntityMetaKey.Selector] != null}
							<div>
								<dt>Submission</dt>
								<dd>
									<RedditLinkView
										selection={select(EntityType.RedditLink, redditLink[EntityMetaKey.Selector])}
										prefetched={redditLink}
										href={
											(
												redditLink[EntityMetaKey.Selector] != null && 'fullname' in redditLink[EntityMetaKey.Selector]
												&& redditLink[EntityMetaKey.Selector].fullname != null ?
													resolve('/reddit/link/[fullname=stringSegment]', {
												fullname: encodeURIComponent(String(redditLink[EntityMetaKey.Selector].fullname ?? '')),
											})
											:
													undefined
											)
										}
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
						{#if redditComment != null && redditComment[EntityMetaKey.Selector] != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<RedditCommentView
										selection={select(EntityType.RedditComment, redditComment[EntityMetaKey.Selector])}
										prefetched={redditComment}
										href={
											(
												redditComment[EntityMetaKey.Selector] != null && 'fullname' in redditComment[EntityMetaKey.Selector]
												&& redditComment[EntityMetaKey.Selector].fullname != null ?
													resolve('/reddit/comment/[fullname=stringSegment]', {
												fullname: encodeURIComponent(String(redditComment[EntityMetaKey.Selector].fullname ?? '')),
											})
											:
													undefined
											)
										}
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
			resource={
				selection({
					sources: selection.sources,
					fields: {
						body: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const body = resolvedEntity.body}
				{#if body !== undefined && body !== null && body !== ''}
					<p data-text="long-text">{String((body) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const redditCommentRedditCommentsViewRepliesResource = selection
		.$$replies({
			sources: [
				Source.Reddit_PublicJson,
			],
		})}
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
									(selection.entitySelector != null && 'fullname' in selection.entitySelector && selection.entitySelector.fullname != null ? resolve('/reddit/comment/[fullname=stringSegment]/replies', {
										fullname: encodeURIComponent(String(selection.entitySelector.fullname ?? '')),
									}) : undefined)
								}
							id='RedditCommentsView-replies'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const redditCommentRedditCommentTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Reddit_PublicJson,
			],
		})}
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
									(selection.entitySelector != null && 'fullname' in selection.entitySelector && selection.entitySelector.fullname != null ? resolve('/reddit/comment/[fullname=stringSegment]/observations', {
										fullname: encodeURIComponent(String(selection.entitySelector.fullname ?? '')),
									}) : undefined)
								}
							id='RedditComment_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
