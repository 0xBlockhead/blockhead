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
	import { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.YoutubeComment>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.YoutubeComment>>
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

	const youtubeComment = $derived(selection({
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
		fields: {
			text: true,
			authorDisplayName: true,
			publishedAt: true,
			publishedAtMs: true,
			$author: true,
			$video: true,
			$parentComment: true,
			...(open && {
				$$timestamps: true,
				$$replies: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).text) ?? '')].filter(Boolean).join(' ') || 'YouTube comment')
	const viewDomId = $derived('youtube-comment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeCommentsView from '$/views/YoutubeCommentsView.svelte'
	import YoutubeComment_TimestampsView from '$/views/YoutubeComment_TimestampsView.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeComment}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={youtubeComment}
			placeholderText="Loading YouTube comment..."
		>
			{#snippet Pending()}
				<TruncatedValue
					value={String(selection.entitySelector.commentId ?? '')}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}

			{#snippet children(entity)}
				<TruncatedValue
					value={String(entity.text ?? '').replaceAll('\n', ' ') || String(selection.entitySelector.commentId ?? '')}
					startLength={64}
					endLength={16}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			<TruncatedValue
				value={String(selection.entitySelector.commentId ?? '')}
				format={TruncatedValueFormat.Visual}
			/>
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const publishedAtMs0 = prefetched.publishedAtMs}
			{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAtMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={youtubeComment}>
				{#snippet Pending()}
					{@const publishedAtMs0 = prefetched.publishedAtMs}
					{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAtMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const publishedAtMs0 = entity.publishedAtMs}
					{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAtMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Comment ids are opaque strings scoped to an 11-character video id; replies reference a parent comment on the same watch page.
		</p>

		<p>
			YouTube REST resolves the canonical published timestamp and parent links, while Piped can fill alternate comment text and timing fields.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={youtubeComment}>
				{#snippet Pending()}
					{@const authorDisplayName = prefetched.authorDisplayName ?? selection.entitySelector.authorDisplayName}
					{#if authorDisplayName !== undefined && authorDisplayName !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((authorDisplayName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const authorDisplayName = entity.authorDisplayName ?? selection.entitySelector.authorDisplayName ?? prefetched.authorDisplayName}
					{#if authorDisplayName !== undefined && authorDisplayName !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((authorDisplayName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.YoutubeChannel, false>('$author')}
				>
					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null}
							<div>
								<dt>Author channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel.entitySelector)}
										prefetched={youtubeChannel}
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
					resource={selection[EntityProxyField]<EntityType.YoutubeVideo, false>('$video')}
				>
					{#snippet children(youtubeVideo)}
						{#if youtubeVideo != null}
							<div>
								<dt>Video</dt>
								<dd>
									<YoutubeVideoView
										selection={select(EntityType.YoutubeVideo, youtubeVideo.entitySelector)}
										prefetched={youtubeVideo}
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
					resource={selection[EntityProxyField]<EntityType.YoutubeComment, false>('$parentComment')}
				>
					{#snippet children(youtubeComment)}
						{#if youtubeComment != null}
							<div>
								<dt>Parent comment</dt>
								<dd>
									<YoutubeCommentView
										selection={select(EntityType.YoutubeComment, youtubeComment.entitySelector)}
										prefetched={youtubeComment}
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

		<ResourceBoundary resource={youtubeComment}>
			{#snippet children(entity)}
				{@const text = entity.text ?? selection.entitySelector.text ?? prefetched.text}
				{#if text === undefined || text === null || text === ''}
					<p data-text="muted">No comment text available.</p>
				{:else}
					<p>{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<YoutubeCommentsView
				selection={
						selection[EntityProxyField]<EntityType.YoutubeComment>('$$replies', {
							sources: [
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							limit: 50,
						})
					}
				title='Replies'
				emptyText='No replies yet.'
				id='YoutubeCommentsView-$$replies'
			/>

			<YoutubeComment_TimestampsView
				selection={
						selection[EntityProxyField]<EntityType.YoutubeComment_Timestamp>('$$timestamps', {
							sources: [
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							limit: 50,
						})
					}
				title='Metric snapshots'
				emptyText='No metric snapshots for this comment yet.'
				id='YoutubeComment_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
