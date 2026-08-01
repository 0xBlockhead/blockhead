<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.YoutubeComment> = $props()

	const youtubeComment = $derived(selection({
		sources: selection.sources ?? [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	})({
		fields: {
			text: true,
			authorDisplayName: true,
			publishedAt: true,
			publishedAtMs: true,
		},
	}))


	// Components
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
	title={title ?? ((prefetched.text ?? '') || 'YouTube comment')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
				{
					videoId: encodeURIComponent(selection.entitySelector.videoId),
					commentId: encodeURIComponent(selection.entitySelector.commentId),
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
		<ResourceBoundary
			resource={youtubeComment}
			placeholderText="Loading YouTube comment..."
		>
			{#snippet Pending()}
				<TruncatedValue
					value={selection.entitySelector.commentId}
				/>
			{/snippet}

			{#snippet children(entity)}
				<TruncatedValue
					value={(entity.text ?? '').replaceAll('\n', ' ') || selection.entitySelector.commentId}
					startLength={64}
					endLength={16}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.commentId} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={youtubeComment}>
			{#snippet children(entity)}
				{@const publishedAtMs = entity.publishedAtMs}
				{#if publishedAtMs != null}
					<span data-text="muted">
						<Timestamp timestamp={publishedAtMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
			<div>
				<dt>Comment ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.commentId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={youtubeComment}
			>
				{#snippet children(entity)}
					{@const authorDisplayName = entity.authorDisplayName}
					{#if authorDisplayName != null}
						<div>
							<dt>Author</dt>
							<dd>
								{authorDisplayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={youtubeComment}
				>
					{#snippet children(entity)}
						{@const publishedAtMs = entity.publishedAtMs}
						{#if publishedAtMs != null}
							<div>
								<dt>Published</dt>
								<dd>
									<Timestamp timestamp={publishedAtMs} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$author}
				>
					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null}
							<div>
								<dt>Author channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
										prefetched={youtubeChannel}
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
					resource={selection.$video}
				>
					{#snippet children(youtubeVideo)}
						{#if youtubeVideo != null}
							<div>
								<dt>Video</dt>
								<dd>
									<YoutubeVideoView
										selection={select(EntityType.YoutubeVideo, youtubeVideo[EntityMetaKey.Selector])}
										prefetched={youtubeVideo}
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
					{#snippet children(youtubeComment)}
						{#if youtubeComment != null}
							<div>
								<dt>Parent comment</dt>
								<dd>
									<YoutubeCommentView
										selection={select(EntityType.YoutubeComment, youtubeComment[EntityMetaKey.Selector])}
										prefetched={youtubeComment}
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
			resource={youtubeComment}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p>{text}</p>
				{:else}
					<p data-text="muted">No comment text available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const repliesResource = selection
			.$$replies({
				sources: [
					Source.Youtube_Rest,
				],
				limit: 50,
			})}
		<ResourceBoundary
			resource={repliesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<YoutubeCommentsView
						selection={repliesResource}
						countResource={repliesResource.count}
						title='Replies'
						id='replies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection
			.$$timestamps({
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				limit: 50,
			})}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<YoutubeComment_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Metric snapshots'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
