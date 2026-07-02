<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const redditComment = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			body: true,
			createdAt: true,
			author: true,
			depth: true,
			...(open && {
				$$replies: true,
				$link: true,
				$parentComment: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).body) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment')
	const viewDomId = $derived('reddit-comment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const body0 = ({ ...selection.entitySelector, ...prefetched }).body}
			{#if body0 !== undefined && body0 !== null}
				<span data-text="long-text">{String((body0) ?? '')}</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditComment}>
				{#snippet Pending()}
					{@const body0 = ({ ...selection.entitySelector, ...prefetched }).body}
					{#if body0 !== undefined && body0 !== null}
						<span data-text="long-text">{String((body0) ?? '')}</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const body0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).body}
					{#if body0 !== undefined && body0 !== null}
						<span data-text="long-text">{String((body0) ?? '')}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
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
					{@const createdAt0 = entity.createdAt}
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
			<ResourceBoundary resource={redditComment}>
				{#snippet Pending()}
					{@const author = prefetched.author ?? selection.entitySelector.author}
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
					{@const author = entity.author ?? selection.entitySelector.author ?? prefetched.author}
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
				<ResourceBoundary resource={redditComment}>
					{#snippet Pending()}
						{@const depth = prefetched.depth ?? selection.entitySelector.depth}
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
						{@const depth = entity.depth ?? selection.entitySelector.depth ?? prefetched.depth}
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
						{#if redditLink != null}
							<div>
								<dt>Submission</dt>
								<dd>
									<RedditLinkView
										selection={select(EntityType.RedditLink, redditLink.entitySelector)}
										prefetched={redditLink}
										layout={EntityLayout.Title}
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
						{#if redditComment != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<RedditCommentView
										selection={select(EntityType.RedditComment, redditComment.entitySelector)}
										prefetched={redditComment}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RedditCommentsView
				selection={selection[EntityProxyField]<EntityType.RedditComment>('$$replies')}
				title='Replies'
				id='RedditCommentsView-$$replies'
			/>
		{/if}
	{/snippet}
</EntityView>
