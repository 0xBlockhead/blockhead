<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(x)/x/post/[postId]', {
			postId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const post = useEntity(
		EntityType.XPost,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XPost]?.map((r) => r.source)
				?? [Source.Local_Internal]
			),
			text: {},
			createdAt: {},
			$author: {
				username: {},
				name: {},
			},
			...(open ?
				{
					likeCount: {},
					retweetCount: {},
					replyCount: {},
					quoteCount: {},
					$$timestamps: {
						$: (
							entityResolversByEntityType[EntityType.XPost_Timestamp]?.map((r) => r.source)
							?? [Source.Local_Internal]
						),
						$limit: 1,
					},
					conversationId: {},
					$replyToPost: {},
					$quotedPost: {},
					postUrl: {},
					$$media: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import XPost_TimestampsView from '$/views/XPost_TimestampsView.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading X post…"
		>
			{#snippet children(post)}
				{#if post.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={post.text}
					/>
					{:else}
						<TruncatedValue
							value={entityId.id}
							format={TruncatedValueFormat.Visual}
						/>
					{/if}
				{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={post}
		>
			{#snippet children(post)}
				{#if post.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={post.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Public posts on X (Twitter): short text, timestamps, and author profile links.
		</p>
		<p>
			Not Reddit threads, storage CIDs, on-chain receipts, or encrypted chats.
		</p>
	{/snippet}

	{#snippet Content({})}
		{#if contentOpen}
			<ResourceBoundary
				resource={post}
				placeholderText="Loading X post…"
			>
				{#snippet children(post)}
					{#if post.text}
						<p>
							<TruncatedValue
								value={post.text}
								format={TruncatedValueFormat.Visual}
							/>
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
			<ResourceBoundary
				resource={post}
				placeholderText="Loading X post…"
			>
				{#snippet children(post)}
					{#if post.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									entityId={post.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Likes',
									value: post.$$timestamps[0]?.likeCount ?? post.likeCount,
								},
								{
									label: 'Reposts',
									value: post.$$timestamps[0]?.retweetCount ?? post.retweetCount,
								},
								{
									label: 'Replies',
									value: post.$$timestamps[0]?.replyCount ?? post.replyCount,
								},
								{
									label: 'Quotes',
									value: post.$$timestamps[0]?.quoteCount ?? post.quoteCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						{#if post.$replyToPost}
							<div>
								<dt>Reply to</dt>
								<dd>
									<svelte:self
										entityId={post.$replyToPost[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						{#if post.$quotedPost}
							<div>
								<dt>Quoted post</dt>
								<dd>
									<svelte:self
										entityId={post.$quotedPost[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						{#if post.postUrl}
							<div>
								<dt>Post URL</dt>
								<dd>
									<a
										href={post.postUrl}
										rel="noreferrer noopener"
										target="_blank"
									>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={post.postUrl}
										/>
									</a>
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
		<CollapsibleTabs
				sectionIdPrefix={`x-post:${entityId.id}`}
					sections={collapsibleTabsSections([
						{ id: 'author', label: 'Author' },
						{ id: 'thread', label: 'Thread' },
						{ id: 'media', label: 'Media' },
						{ id: 'metric-snapshots', label: 'Metrics' },
					])}
				id={`x-post:${entityId.id}:carousel`}
				data-card
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Post details
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAuthor()}
					<ResourceBoundary
						resource={post}
						placeholderText="Loading X post…"
					>
						{#snippet children(post)}
							{#if post.$author}
								<XUserView
									entityId={post.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionThread()}
					{#if _open}
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								<div>
									{#if post.$replyToPost}
										<div>
											<strong>Reply to:</strong>
											<svelte:self
												entityId={post.$replyToPost[EntityMetaKey.Id]}
												layout={EntityLayout.Value}
												open={false}
											/>
										</div>
									{/if}

									{#if post.$quotedPost}
										<div>
											<strong>Quoted post:</strong>
											<svelte:self
												entityId={post.$quotedPost[EntityMetaKey.Id]}
												layout={EntityLayout.Value}
												open={false}
											/>
										</div>
									{/if}

									{#if (
										post.$replyToPost == null
										&& post.$quotedPost == null
									)}
										<p data-text="muted">
											No reply or quote references on this post.
										</p>
									{/if}
								</div>
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}

					{#snippet SectionMedia()}
						{#if _open}
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if (post.$$media?.length ?? 0) > 0}
									<div data-column="gap-3">
										{#each post.$$media ?? [] as media (media[EntityMetaKey.Id].url)}
											<Media
												alt=""
												media={{ url: media[EntityMetaKey.Id].url }}
											/>
										{/each}
									</div>
								{:else}
									<p data-text="muted">
										No media attachments on this post.
									</p>
								{/if}
							{/snippet}
							</ResourceBoundary>
						{/if}
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<XPost_TimestampsView
							entityFieldReference={{
								entityType: EntityType.XPost,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`x-post:${entityId.id}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
