<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
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
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
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
				{(
					comment.text ?
						comment.text
					:
						entityId.commentId
				)}
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
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.authorDisplayName}
									{comment.authorDisplayName}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Likes</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.likeCount != null}
									{String(comment.likeCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Replies</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.replyCount != null}
									{String(comment.replyCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.publishedAtMs != null}
									<Timestamp timestamp={comment.publishedAtMs} />
								{:else if comment.publishedAt != null}
									{comment.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Channel</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
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
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Video</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.$video !== undefined}
									<YouTubeVideoView
										entityId={comment.$video[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Parent comment</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.$parentComment !== undefined}
									<YouTubeCommentView
										entityId={comment.$parentComment[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
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
						limit: 50,
					},
				},
			)}
			{#if repliesParent.$parentComment === undefined}
				{@const replies = derive(
					repliesParent,
					(repliesParent) => (
						(repliesParent.$$replies ?? []).map((reply) => reply[EntityMetaKey.Id])
					),
				)}
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
					resource={replies}
					placeholderText="Loading replies…"
					getKey={(row) => stringify(row)}
					getSortValue={(row) => (
						`${String(-(row.publishedAtMs ?? 0)).padStart(20, '0')}\0${row.commentId}`
					)}
					placeholderKeys={new SvelteSet<string>()}
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
			{/if}
		{/if}

	{/snippet}
</EntityView>
