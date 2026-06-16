<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(x)/x/post/[postId]', {
			postId: selector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.XPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const post = $derived(
		subscribe(
			EntityType.XPost,
			selector,
			({
				fields: {
					text: true,
					createdAt: true,
					$author: {
						fields: {
							username: true,
							name: true,
						},
					},
					...(open && {
						$$timestamps: {
							limit: 1,
						},
						conversationId: true,
						$replyToPost: true,
						$quotedPost: true,
						postUrl: true,
						$$media: true,
					}),
				},
			}),
		)
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
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.id}
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
						value={selector.id}
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
									selector={post.fields.$author[EntityMetaKey.Selector]}
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
									value: post.fields.$$timestamps?.values.at(0)?.likeCount,
								},
								{
									label: 'Reposts',
									value: post.fields.$$timestamps?.values.at(0)?.retweetCount,
								},
								{
									label: 'Replies',
									value: post.fields.$$timestamps?.values.at(0)?.replyCount,
								},
								{
									label: 'Quotes',
									value: post.fields.$$timestamps?.values.at(0)?.quoteCount,
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
										selector={post.fields.$replyToPost[EntityMetaKey.Selector]}
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
										selector={post.fields.$quotedPost[EntityMetaKey.Selector]}
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
			sectionIdPrefix={`x-post:${selector.id}`}
			sections={collapsibleTabsSections([
				{ id: 'author', label: 'Author' },
				{ id: 'thread', label: 'Thread' },
				{ id: 'media', label: 'Media' },
				{ id: 'metric-snapshots', label: 'Metrics' },
			])}
			id={`x-post:${selector.id}:carousel`}
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
								selector={post.fields.$author[EntityMetaKey.Selector]}
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
											selector={post.fields.$replyToPost[EntityMetaKey.Selector]}
											layout={EntityLayout.Value}
											open={false}
										/>
									</div>
								{/if}

								{#if post.fields.$quotedPost}
									<div>
										<strong>Quoted post:</strong>
										<svelte:self
											selector={post.fields.$quotedPost[EntityMetaKey.Selector]}
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
									{#each post.fields.$$media.values as media (media[EntityMetaKey.Selector].url)}
										<Media
											alt=""
											media={{ url: media[EntityMetaKey.Selector].url }}
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
						selector,
						fieldName: '$$timestamps',
					}}
					href={href}
					id={`x-post:${selector.id}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
