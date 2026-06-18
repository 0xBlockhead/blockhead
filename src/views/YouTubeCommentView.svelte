<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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

	const comment = $derived(
		select(
			EntityType.YouTubeComment,
			selector,
			({ sources: [
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

	const idKey = $derived(stringify(selector))


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
					value={
						comment.fields.text ?
							comment.fields.text.replaceAll('\n', ' ')
						:
							selector.commentId
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
									value: comment.fields.$$timestamps.values.at(0)?.likeCount,
								},
								{
									label: 'Replies',
									value: comment.fields.$$timestamps.values.at(0)?.replyCount,
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
									<YouTubeCommentView
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
			{@const repliesParent = select(EntityType.YouTubeComment,
				selector,
				({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], fields: { $parentComment: true, $$replies: ({ sources: [
					Source.Youtube_Rest,
				], limit: 50 }) } }),
			)}
			{@const replies = select(EntityType.YouTubeComment,
				selector,
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
					{#if repliesParent.fields.$parentComment === undefined}
							<EntitiesList
								entityType={EntityType.YouTubeComment}
								href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
									videoId: encodeURIComponent(selector.videoId),
									commentId: encodeURIComponent(selector.commentId),
								})}
								id={`${idKey}:replies`}
								title={`Replies (${String(repliesParent.fields.$$replies.values.length)})`}
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
									title={`Replies (${String(repliesParent.fields.$$replies.values.length)})`}
									items={replies.entities}
									placeholderText="Loading replies…"
									getKey={(comment) => stringify(comment.entitySelector)}
									getSortValue={(comment) => comment.entitySelector.commentId}
									placeholderKeys={new SvelteSet<string>()}
									open={true}
								>
									{#snippet Empty()}
										<p data-text="muted">
											{
												repliesParent.fields.$$replies.values.length === 0 ?
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
											selector={comment.entitySelector}
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
						</EntitiesList>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<YouTubeComment_TimestampsView
				selection={select(
					EntityType.YouTubeComment,
					selector
				).$$timestamps}
				href={href}
				id={`${idKey}:metric-snapshots`}
				title="Metric snapshots"
			/>
		{/if}
	{/snippet}
</EntityView>
