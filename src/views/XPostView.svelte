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
		href = resolve('/(social)/x/post/[postId]', {
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
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import XPostView from '$/views/XPostView.svelte'
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
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
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
					{@render Title()}
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

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Author</dt>
				<dd>
					<ResourceBoundary
						resource={post}
						placeholderText="Loading X post…"
					>
						{#snippet children(post)}
							{#if post.$author}
								<XUserView
									entityId={post.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Text</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.text}
									{post.text}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Likes</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.likeCount != null}
									<NumberValue
										value={post.likeCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reposts</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.retweetCount != null}
									<NumberValue
										value={post.retweetCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Replies</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.replyCount != null}
									<NumberValue
										value={post.replyCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Quotes</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.quoteCount != null}
									<NumberValue
										value={post.quoteCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reply to</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.$replyToPost}
									<XPostView
										entityId={post.$replyToPost[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Quoted post</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.$quotedPost}
									<XPostView
										entityId={post.$quotedPost[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Post URL</dt>
					<dd>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								{#if post.postUrl}
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
			entityType={EntityType.XPost}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={`x-post:${entityId.id}`}
				sections={[
					{ id: 'author', label: 'Author' },
					...(_open ? [
						{ id: 'thread', label: 'Thread' },
						{ id: 'media', label: 'Media' },
					] : []),
				]}
				id={`x-post:${entityId.id}:carousel`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet SectionAuthor({ id, label })}
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

				{#snippet SectionThread({ id, label })}
					{#if _open}
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(post)}
								<dl data-column-item="center">
									{#if post.$replyToPost}
										<div>
											<dt>Reply to</dt>
											<dd>
												<XPostView
													entityId={post.$replyToPost[EntityMetaKey.Id]}
													layout={EntityLayout.Title}
													open={false}
												/>
											</dd>
										</div>
									{/if}

									{#if post.$quotedPost}
										<div>
											<dt>Quoted post</dt>
											<dd>
												<XPostView
													entityId={post.$quotedPost[EntityMetaKey.Id]}
													layout={EntityLayout.Title}
													open={false}
												/>
											</dd>
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
								</dl>
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}

				{#snippet SectionMedia({ id, label })}
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
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

