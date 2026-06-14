<script lang="ts">
	// Types/constants
		import type { ComponentProps, Snippet } from 'svelte'
		import type { Entity, EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
			{
				videoId: encodeURIComponent(selector.videoId),
				commentId: encodeURIComponent(selector.commentId),
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.YouTubeComment>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'CollapsibleProps'
			| 'HeadingAfter'
			| 'idDragPlainText'
			| 'ontoggle'
			| 'showTypeAnnotation'
			| 'Title'
			| 'TypeAnnotationTooltip'
			| 'Value'
		>
	> = $props()

	const comment = subscribe(EntityType.YouTubeComment,
		selector,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { text: true, authorDisplayName: true, authorChannelId: true, $author: true, likeCount: true, replyCount: true, $$timestamps: ({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], limit: 1 }), publishedAt: true, publishedAtMs: true, $video: true, $parentComment: true } }),
	)

	const idKey = stringify(selector)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeComment_TimestampsView from '$/views/YouTubeComment_TimestampsView.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeComment}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			<TruncatedValue
				value={selector.commentId}
				format={TruncatedValueFormat.Visual}
			/>
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading YouTube comment…"
		>
			{#snippet children(comment)}
				<TruncatedValue
					value={(
						comment.fields.text ?
							comment.fields.text.replaceAll('\n', ' ')
						:
							selector.commentId
					)}
					startLength={64}
					endLength={16}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Comment ids are opaque strings scoped to an 11-char videoId; replies reference a parent comment on the same watch page.
		</p>
		<p>
			Youtube_Rest sets ISO publishedAt and parent-comment links; Piped fills alternate time strings—not cast hashes or XMTP topics.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading YouTube comment…"
		>
			{#snippet children(comment)}
				{#if comment.fields.text}
					<p>
						<TruncatedValue
							value={comment.fields.text}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						{#if comment.fields.authorDisplayName}
							<div>
								<dt>Author</dt>
								<dd>
									{comment.fields.authorDisplayName}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Likes',
									value: comment.fields.$$timestamps[0]?.likeCount ?? comment.fields.likeCount,
								},
								{
									label: 'Replies',
									value: comment.fields.$$timestamps[0]?.replyCount ?? comment.fields.replyCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						{#if comment.fields.publishedAtMs != null || comment.fields.publishedAt != null}
							<div>
								<dt>Published</dt>
								<dd>
									{#if comment.fields.publishedAtMs != null}
										<Timestamp timestamp={comment.fields.publishedAtMs} />
									{:else if comment.fields.publishedAt != null}
										{comment.fields.publishedAt}
									{/if}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						{#if comment.fields.$author || comment.fields.authorChannelId}
							<div>
								<dt>Channel</dt>
								<dd>
									{#if comment.fields.$author}
										<YouTubeChannelView
											selector={comment.fields.$author[EntityMetaKey.Selector]}
											layout={EntityLayout.Value}
											open={false}
										/>
									{:else if comment.fields.authorChannelId}
										<YouTubeChannelView
											selector={{ channelId: comment.fields.authorChannelId }}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						{#if comment.fields.$video !== undefined}
							<div>
								<dt>Video</dt>
								<dd>
									<YouTubeVideoView
										selector={comment.fields.$video[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={comment}
					placeholderText="Loading YouTube comment…"
				>
					{#snippet children(comment)}
						{#if comment.fields.$parentComment !== undefined}
							<div>
								<dt>Parent comment</dt>
								<dd>
									<svelte:self
										selector={comment.fields.$parentComment[EntityMetaKey.Selector]}
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
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if _open}
			{@const repliesParent = subscribe(EntityType.YouTubeComment,
				selector,
				({ sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					], fields: { $parentComment: true, replyCount: ({ sources: [Source.Youtube_Rest] }), $$replies: ({ sources: [
							Source.Youtube_Rest,
						], limit: 50 }) } }),
				)}
				{@const replies = derive(
					repliesParent,
					(repliesParent) => {
						const youTubeComments: readonly Entity<typeof schema, EntityType.YouTubeComment>[] = repliesParent.$$replies ?? []
						return youTubeComments.map((reply) => reply[EntityMetaKey.Selector])
					},
				)}
				{@const repliesParentRow = repliesParent.ready ? repliesParent.current : undefined}
				{#if repliesParentRow?.$parentComment === undefined}
					<EntitiesList
						entityType={EntityType.YouTubeComment}
						href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
							videoId: encodeURIComponent(selector.videoId),
							commentId: encodeURIComponent(selector.commentId),
						})}
						id={`${idKey}:replies`}
						title={(
							repliesParentRow?.replyCount != null ?
								`Replies (${String(repliesParentRow.replyCount)})`
							:
								'Replies'
						)}
						collapsible={false}
					>
						{#snippet body()}
							<EntitiesList
								collapsible={false}
								showSummary={false}
								entityType={EntityType.YouTubeComment}
								href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
									videoId: encodeURIComponent(selector.videoId),
									commentId: encodeURIComponent(selector.commentId),
								})}
								id={`${idKey}:replies-items`}
								title={(
									repliesParentRow?.replyCount != null ?
										`Replies (${String(repliesParentRow.replyCount)})`
									:
										'Replies'
								)}
								resource={replies}
								placeholderText="Loading replies…"
								getKey={(row) => stringify(row)}
								getSortValue={(youTubeComment) => youTubeComment.commentId}
								placeholderKeys={new SvelteSet<string>()}
								open={true}
							>
								{#snippet Empty()}
									<p data-text="muted">
										{(
											repliesParentRow?.replyCount === 0 ?
												'No replies yet.'
											:
												'Replies could not be loaded.'
										)}
									</p>
								{/snippet}

								{#snippet Item({
									item: comment,
								})}
									<svelte:self
										selector={{
											videoId: comment.videoId,
											commentId: comment.commentId,
										}}
										href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
											videoId: encodeURIComponent(comment.videoId),
											commentId: encodeURIComponent(comment.commentId),
										})}
										layout={EntityLayout.SummaryDetails}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</EntitiesList>
				{/if}

				<YouTubeComment_TimestampsView
					entityFieldReference={{
							entityType: EntityType.YouTubeComment,
							selector,
							fieldName: '$$timestamps',
					}}
					href={href}
					id={`${idKey}:metric-snapshots`}
					title="Metric snapshots"
					/>
			{/if}

		{/snippet}
</EntityView>
