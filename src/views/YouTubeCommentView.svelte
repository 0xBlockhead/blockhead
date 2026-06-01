<script lang="ts">
	// Types/constants
		import type { ComponentProps, Snippet } from 'svelte'
		import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
			{
				videoId: encodeURIComponent(entityId.videoId),
				commentId: encodeURIComponent(entityId.commentId),
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeComment>
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


		// State
		import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
		import { useEntity } from '$/collections/$queries.svelte.ts'

	const comment = useEntity(
		EntityType.YouTubeComment,
		entityId,
		{
			$: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
			text: {},
			authorDisplayName: {},
			authorChannelId: {},
			$author: {},
			likeCount: {},
			replyCount: {},
			$$timestamps: {
				$: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				$limit: 1,
			},
			publishedAt: {},
			publishedAtMs: {},
			$video: {},
			$parentComment: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			<TruncatedValue
				value={entityId.commentId}
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
						comment.text ?
							comment.text.replaceAll('\n', ' ')
						:
							entityId.commentId
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
									value: comment.$$timestamps[0]?.likeCount ?? comment.likeCount,
								},
								{
									label: 'Replies',
									value: comment.$$timestamps[0]?.replyCount ?? comment.replyCount,
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
											entityId={comment.$author[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
											open={false}
										/>
									{:else if comment.authorChannelId}
										<YouTubeChannelView
											entityId={{ channelId: comment.authorChannelId }}
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
										entityId={comment.$video[EntityMetaKey.Id]}
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
									<svelte:self
										entityId={comment.$parentComment[EntityMetaKey.Id]}
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
			{@const repliesParent = useEntity(
				EntityType.YouTubeComment,
				entityId,
				{
					$: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
					$parentComment: {},
					replyCount: {
						$: [Source.Youtube_Rest],
					},
					$$replies: {
						$: [
							Source.Youtube_Rest,
						],
							$limit: 50,
					},
				},
				)}
				{@const replies = derive(
					repliesParent,
					(repliesParent) => {
						const rows: Entity<typeof schema, EntityType.YouTubeComment>[] = repliesParent.$$replies ?? []
						return rows.map((reply) => reply[EntityMetaKey.Id])
					},
				)}
				{#if repliesParent.$parentComment === undefined}
					<EntitiesList
						entityType={EntityType.YouTubeComment}
						href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
							videoId: encodeURIComponent(entityId.videoId),
							commentId: encodeURIComponent(entityId.commentId),
						})}
						id={`${idKey}:replies`}
						title={(
							repliesParent.replyCount != null ?
								`Replies (${String(repliesParent.replyCount)})`
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
									videoId: encodeURIComponent(entityId.videoId),
									commentId: encodeURIComponent(entityId.commentId),
								})}
								id={`${idKey}:replies-items`}
								title={(
									repliesParent.replyCount != null ?
										`Replies (${String(repliesParent.replyCount)})`
									:
										'Replies'
								)}
								resource={replies}
								placeholderText="Loading replies…"
								getKey={(row) => stringify(row)}
								getSortValue={(row) => row.commentId}
								placeholderKeys={new SvelteSet<string>()}
								open={true}
							>
								{#snippet Empty()}
									<p data-text="muted">
										{(
											repliesParent.replyCount === 0 ?
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
										entityId={{
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
							entityId,
							fieldName: '$$timestamps',
						}}
						href={href}
						id={`${idKey}:metric-snapshots`}
						title="Metric snapshots"
					/>
			{/if}

		{/snippet}
</EntityView>
