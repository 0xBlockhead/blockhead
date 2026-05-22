<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.YouTubeComment>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

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
			likeCount: {},
			publishedAt: {},
			$video: {},
			$parentComment: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeComment}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span>
			<TruncatedValue
				value={entityId.commentId}
				format={TruncatedValueFormat.Visual}
			/>
		</span>
	{/snippet}

		{Title()}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Text</dt>
				<dd>
					<ResourceBoundary
						resource={comment}
						placeholderText="Loading YouTube comment…"
					>
						{#snippet children(comment)}
							{#if comment.text}
								{comment.text}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
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
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading YouTube comment…"
						>
							{#snippet children(comment)}
								{#if comment.publishedAt != null}
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
								{#if comment.authorChannelId}
									<YouTubeChannelView
										entityId={{ channelId: comment.authorChannelId }}
										href={resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
											channelId: encodeURIComponent(comment.authorChannelId),
										})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
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
										href={resolve('/(social)/(youtube)/youtube/video/[videoId]', {
											videoId: encodeURIComponent(
												comment.$video[EntityMetaKey.Id].videoId,
											),
										})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
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
										href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
											videoId: encodeURIComponent(
												comment.$parentComment[EntityMetaKey.Id].videoId,
											),
											commentId: encodeURIComponent(
												comment.$parentComment[EntityMetaKey.Id].commentId,
											),
										})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
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
		<EntityDetails
			entityType={EntityType.YouTubeComment}
			{entityId}
		>
			<ResourceBoundary
				resource={comment}
				placeholderText="Loading YouTube comment…"
			>
				{#snippet children(_comment)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if _open}
			{@const repliesParent = useEntity(
				EntityType.YouTubeComment,
				entityId,
				{
					$: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
					$$replies: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						limit: 50,
					},
				},
			)}
			{@const replies = derive(
				repliesParent,
				(repliesParent) => (
					(repliesParent.$$replies ?? [])
						.toSorted((a, b) => (
							(b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
							|| b[EntityMetaKey.IdKey].localeCompare(a[EntityMetaKey.IdKey])
						))
						.map((reply) => ({
							...reply[EntityMetaKey.Id],
							sortKey: reply[EntityMetaKey.IdKey],
						}))
				),
			)}
			<EntitiesList
				entityType={EntityType.YouTubeComment}
				href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
					videoId: encodeURIComponent(entityId.videoId),
					commentId: encodeURIComponent(entityId.commentId),
				})}
				id={`${idKey}:replies`}
				title="Replies"
				resource={replies}
				placeholderText="Loading replies…"
				getKey={(row) => stringify(row)}
				getSortValue={(row) => row.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No replies yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: row,
				})}
					{#if row}
						<svelte:self
							entityId={{
								videoId: row.videoId,
								commentId: row.commentId,
							}}
							href={resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]', {
								videoId: encodeURIComponent(row.videoId),
								commentId: encodeURIComponent(row.commentId),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
