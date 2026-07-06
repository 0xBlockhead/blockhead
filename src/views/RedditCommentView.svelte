<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditComment>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RedditComment>>
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
	const redditComment = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			body: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.body) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.fullname ?? prefetched.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment')
	const viewDomId = $derived('reddit-comment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={redditComment}>
			{#snippet Pending()}
				{@const body0 = prefetched.body}
				{#if body0 !== undefined && body0 !== null}
					<span data-text="long-text">{String((body0) ?? '')}</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const body0 = resolvedEntity.body}
				{#if body0 !== undefined && body0 !== null}
					<span data-text="long-text">{String((body0) ?? '')}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditComment}>
			{#snippet Pending()}
				{@const createdAt0 = prefetched.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Comment ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fullname: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fullname = selection.entitySelector.fullname ?? prefetched.fullname}
							{#if fullname !== undefined && fullname !== null}
								<TruncatedValue value={String((fullname) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const author = prefetched.author}
					{#if author !== undefined && author !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((author) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const createdAt = prefetched.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

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
							fields: {
								depth: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const depth = prefetched.depth}
						{#if depth !== undefined && depth !== null}
							<div>
								<dt>Depth</dt>
								<dd>
									{String((depth) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
					resource={selection[EntityProxyField]<EntityType.RedditLink, false>('$link')}
				>
					{#snippet children(redditLink)}
						{#if redditLink != null && redditLink[EntityMetaKey.Selector] != null}
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
					resource={selection[EntityProxyField]<EntityType.RedditComment, false>('$parentComment')}
				>
					{#snippet children(redditComment)}
						{#if redditComment != null && redditComment[EntityMetaKey.Selector] != null}
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
			resource={
				selection({
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
		{#if detailsOpen}
			<RedditCommentsView
				selection={
						selection[EntityProxyField]<EntityType.RedditComment>('$$replies', {
							sources: [
								Source.Constants_Internal,
								Source.Reddit_PublicJson,
							],
						})
					}
				title='Replies'
				id='RedditCommentsView-$$replies'
			/>
		{/if}
	{/snippet}
</EntityView>
