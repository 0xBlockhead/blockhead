<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { Entity, EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
			{
				videoId: encodeURIComponent(selection.entitySelector.videoId),
				commentId: encodeURIComponent(selection.entitySelector.commentId),
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeComment>
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


	const comment = $derived(
		selection(({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: {
				text: true,
				authorDisplayName: true,
				authorChannelId: true,
				$author: true,
				$$timestamps: ({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], limit: 1 }),
				publishedAt: true,
				publishedAtMs: true,
				$video: true,
				$parentComment: true,
			} }),
		)
	)

	const idKey = $derived(stringify(selection.entitySelector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeCommentView from '$/views/YouTubeCommentView.svelte'
	import YouTubeComment_TimestampsView from '$/views/YouTubeComment_TimestampsView.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeComment}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			<TruncatedValue
				value={selection.entitySelector.commentId}
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
					value={
						comment.text ?
							comment.text.replaceAll('\n', ' ')
						:
							selection.entitySelector.commentId
					}
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
				{#if comment.text}
					<p>
						<TruncatedValue
							value={comment.text}
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
						{#if comment.authorDisplayName}
							<div>
								<dt>Author</dt>
								<dd>
									{comment.authorDisplayName}
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
									value: comment.$$timestamps?.values.at(0)?.likeCount,
								},
								{
									label: 'Replies',
									value: comment.$$timestamps?.values.at(0)?.replyCount,
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
						{#if comment.publishedAtMs != null || comment.publishedAt != null}
							<div>
								<dt>Published</dt>
								<dd>
									{#if comment.publishedAtMs != null}
										<Timestamp timestamp={comment.publishedAtMs} />
									{:else if comment.publishedAt != null}
										{comment.publishedAt}
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
						{#if comment.$author || comment.authorChannelId}
							<div>
								<dt>Channel</dt>
								<dd>
									{#if comment.$author}
										<YouTubeChannelView
											selection={select(EntityType.YouTubeChannel, comment.$author[EntityMetaKey.Selector])}
											layout={EntityLayout.Value}

											open={false}
											/>
									{:else if comment.authorChannelId}
										<YouTubeChannelView
											selection={select(EntityType.YouTubeChannel, { channelId: comment.authorChannelId })}
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
						{#if comment.$video !== undefined}
							<div>
								<dt>Video</dt>
								<dd>
									<YouTubeVideoView
										selection={select(EntityType.YouTubeVideo, comment.$video[EntityMetaKey.Selector])}
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
						{#if comment.$parentComment !== undefined}
							<div>
								<dt>Parent comment</dt>
								<dd>
									<YouTubeCommentView
										selection={select(EntityType.YouTubeComment, comment.$parentComment[EntityMetaKey.Selector])}
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
			{@const repliesParent = selection(
				({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], fields: { $parentComment: true, $$replies: ({ sources: [
					Source.Youtube_Rest,
				], limit: 50 }) } }),
			)}
			{@const replies = selection(
				{
					sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
				},
			).$$replies({
				sources: [
					Source.Youtube_Rest,
				],
				limit: 50,
			})}
			<ResourceBoundary
				resource={repliesParent}
				placeholderText="Loading replies…"
			>
				{#snippet children(repliesParent)}
					{#if repliesParent.$parentComment === undefined}
						{@const replyCount = repliesParent.$$replies?.values.length ?? 0}
							<EntitiesList
								entityType={EntityType.YouTubeComment}
								href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
									videoId: encodeURIComponent(selection.entitySelector.videoId),
									commentId: encodeURIComponent(selection.entitySelector.commentId),
								})}
								id={`${idKey}:replies`}
								title={`Replies (${String(replyCount)})`}
								collapsible={false}
							>
							{#snippet body()}
								<ResourceBoundary
									resource={replies}
									placeholderText="Loading replies…"
								>
									{#snippet children(replies)}
										<EntitiesList
											collapsible={false}
											showSummary={false}
											entityType={EntityType.YouTubeComment}
											href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
												videoId: encodeURIComponent(selection.entitySelector.videoId),
												commentId: encodeURIComponent(selection.entitySelector.commentId),
											})}
											id={`${idKey}:replies-items`}
											title={`Replies (${String(replyCount)})`}
											items={replies.values}
											placeholderText="Loading replies…"
											getKey={(comment) => stringify(comment.entitySelector)}
											getSortValue={(comment) => comment.entitySelector.commentId}
											placeholderKeys={new SvelteSet<string>()}
											open={true}
										>
											{#snippet Empty()}
												<p data-text="muted">
													{
														replyCount === 0 ?
															'No replies yet.'
														:
															'Replies could not be loaded.'
													}
												</p>
											{/snippet}

											{#snippet Item({
												item: comment,
											})}
												<YouTubeCommentView
													selection={select(EntityType.YouTubeComment, comment.entitySelector)}
													href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
														videoId: encodeURIComponent(comment.entitySelector.videoId),
														commentId: encodeURIComponent(comment.entitySelector.commentId),
													})}
													layout={EntityLayout.SummaryDetails}
													open={false}
												/>
											{/snippet}
										</EntitiesList>
									{/snippet}
								</ResourceBoundary>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<YouTubeComment_TimestampsView
				selection={selection.$$timestamps}
				href={href}
				id={`${idKey}:metric-snapshots`}
				title="Metric snapshots"
			/>
		{/if}
	{/snippet}
</EntityView>
