<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { resolverDefinitionsByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	const post = useEntity(entityCollectionsContext, EntityType.XPost,
		entityId,
		({ sources: (
				resolverDefinitionsByEntityType[EntityType.XPost]?.map((r) => r.source)
				?? [Source.Local_Internal]
			), fields: { text: true, createdAt: true, $author: ({ fields: { username: true, name: true } }), ...(open ? ({ likeCount: true, retweetCount: true, replyCount: true, quoteCount: true, $$timestamps: ({ sources: (
							resolverDefinitionsByEntityType[EntityType.XPost_Timestamp]?.map((r) => r.source)
							?? [Source.Local_Internal]
						), limit: 1 }), conversationId: true, $replyToPost: true, $quotedPost: true, postUrl: true, $$media: true }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
				{#if post.fields.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={post.fields.text}
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
				{#if post.fields.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={post.fields.createdAt}
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

	{#snippet Content({ open })}
		{#if open}
			<ResourceBoundary
				resource={post}
				placeholderText="Loading X post…"
			>
				{#snippet children(post)}
					{#if post.fields.text}
						<p>
							<TruncatedValue
								value={post.fields.text}
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
					{#if post.fields.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									entityId={post.fields.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary
					resource={post}
					placeholderText="Loading X post…"
				>
					{#snippet children(post)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Likes',
									value: post.fields.$$timestamps[0]?.likeCount ?? post.fields.likeCount,
								},
								{
									label: 'Reposts',
									value: post.fields.$$timestamps[0]?.retweetCount ?? post.fields.retweetCount,
								},
								{
									label: 'Replies',
									value: post.fields.$$timestamps[0]?.replyCount ?? post.fields.replyCount,
								},
								{
									label: 'Quotes',
									value: post.fields.$$timestamps[0]?.quoteCount ?? post.fields.quoteCount,
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
						{#if post.fields.$replyToPost}
							<div>
								<dt>Reply to</dt>
								<dd>
									<svelte:self
										entityId={post.fields.$replyToPost[EntityMetaKey.Id]}
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
						{#if post.fields.$quotedPost}
							<div>
								<dt>Quoted post</dt>
								<dd>
									<svelte:self
										entityId={post.fields.$quotedPost[EntityMetaKey.Id]}
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
						{#if post.fields.postUrl}
							<div>
								<dt>Post URL</dt>
								<dd>
									<a
										href={post.fields.postUrl}
										rel="noreferrer noopener"
										target="_blank"
									>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={post.fields.postUrl}
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
						{#if post.fields.$author}
							<XUserView
								entityId={post.fields.$author[EntityMetaKey.Id]}
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
								{#if post.fields.$replyToPost}
									<div>
										<strong>Reply to:</strong>
										<svelte:self
											entityId={post.fields.$replyToPost[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
											open={false}
										/>
									</div>
								{/if}

								{#if post.fields.$quotedPost}
									<div>
										<strong>Quoted post:</strong>
										<svelte:self
											entityId={post.fields.$quotedPost[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
											open={false}
										/>
									</div>
								{/if}

								{#if (
									post.fields.$replyToPost == null
									&& post.fields.$quotedPost == null
								)}
									<p data-text="muted">
										No reply or quote references on this post.fields.
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
						{#if (post.fields.$$media?.values.length ?? 0) > 0}
							<div data-column="gap-3">
								{#each post.fields.$$media.values as media (media[EntityMetaKey.Id].url)}
									<Media
										alt=""
										media={{ url: media[EntityMetaKey.Id].url }}
									/>
								{/each}
							</div>
						{:else}
							<p data-text="muted">
								No media attachments on this post.fields.
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
