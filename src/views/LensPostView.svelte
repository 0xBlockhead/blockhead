<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		routeChildren,
		entityId,
		href = resolve('/(social)/(lens)/lens/post/[postId]', {
			postId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			routeChildren?: Snippet
			entityId: EntityId<typeof schema, EntityType.LensPost>
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

	const lensPost = useEntity(
		EntityType.LensPost,
		entityId,
		{
			$: [
				Source.Lens_Graphql,
				Source.Lens_HeyGraphql,
			],
			text: {},
			timestamp: {},
			isEdited: {},
			isDeleted: {},
			commentCount: {},
			repostCount: {},
			quoteCount: {},
			bookmarkCount: {},
			collectCount: {},
			reactionCount: {},
			$$timestamps: {
				$: [
					Source.Lens_Graphql,
					Source.Lens_HeyGraphql,
				],
				$limit: 1,
			},
			$author: {},
			$commentOn: {},
			$quoteOf: {},
			$repostOf: {},
			$root: {},
		},
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensCommentsView from '$/views/LensCommentsView.svelte'
	import LensPost_TimestampsView from '$/views/LensPost_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			startLength={24}
			endLength={12}
			value={entityId.id}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading Lens publication…"
			resource={lensPost}
		>
			{#snippet children(lensPost)}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					startLength={42}
					endLength={14}
					value={(
						lensPost.text
							? lensPost.text
						:
							entityId.id
					)}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={lensPost}
		>
			{#snippet children(lensPost)}
				{#if lensPost.timestamp != null}
					<span data-text="muted">
						<Timestamp
							timestamp={lensPost.timestamp}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 publications are on-chain posts keyed by slug; author profiles, comment threads, and engagement counts resolve from Lens GraphQL indexers.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading Lens publication…"
			resource={lensPost}
		>
			{#snippet children(lensPost)}
				{#if lensPost.text != null && lensPost.text !== ''}
					<p>
						<TruncatedValue
							value={lensPost.text}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if lensPost.timestamp != null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={lensPost.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									entityId={lensPost.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.$repostOf}
						<div>
							<dt>Repost of</dt>
							<dd>
							<svelte:self
									entityId={lensPost.$repostOf[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.$quoteOf}
						<div>
							<dt>Quote of</dt>
							<dd>
							<svelte:self
									entityId={lensPost.$quoteOf[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.$commentOn}
						<div>
							<dt>Comment on</dt>
							<dd>
							<svelte:self
									entityId={lensPost.$commentOn[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.isEdited === true}
						<div>
							<dt>Edited</dt>
							<dd>Yes</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.isDeleted === true}
						<div>
							<dt>Deleted</dt>
							<dd>Yes</dd>
						</div>
					{/if}

					{#if contentOpen}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Comments',
									value: lensPost.$$timestamps[0]?.commentCount ?? lensPost.commentCount,
								},
								{
									label: 'Reposts',
									value: lensPost.$$timestamps[0]?.repostCount ?? lensPost.repostCount,
								},
								{
									label: 'Quotes',
									value: lensPost.$$timestamps[0]?.quoteCount ?? lensPost.quoteCount,
								},
								{
									label: 'Bookmarks',
									value: lensPost.$$timestamps[0]?.bookmarkCount ?? lensPost.bookmarkCount,
								},
								{
									label: 'Collects',
									value: lensPost.$$timestamps[0]?.collectCount ?? lensPost.collectCount,
								},
								{
									label: 'Reactions',
									value: lensPost.$$timestamps[0]?.reactionCount ?? lensPost.reactionCount,
								},
							]}
						/>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const postDetailKey = stringify(entityId)}
		<CollapsibleTabs
				id={`${postDetailKey}:carousel-lens-post`}
				sectionIdPrefix={postDetailKey}
				sections={(
					routeChildren ?
							collapsibleTabsSections([
								{ id: 'lens-post-text', label: 'Text' },
								{ id: 'lens-post-comments', label: 'Comments' },
								{ id: 'lens-post-record', label: 'Record' },
								{ id: 'metric-snapshots', label: 'Metrics' },
								{ id: 'lens-post-more', label: 'More' },
							])
					:
							collapsibleTabsSections([
								{ id: 'lens-post-text', label: 'Text' },
								{ id: 'lens-post-comments', label: 'Comments' },
								{ id: 'lens-post-record', label: 'Record' },
								{ id: 'metric-snapshots', label: 'Metrics' },
							])
					)}
				data-card
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Lens publication
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLensPostText()}
					<ResourceBoundary
						resource={lensPost}
						placeholderText="Loading Lens publication…"
					>
						{#snippet children(lensPost)}
							{#if lensPost.text}
								<p>{lensPost.text}</p>
							{:else}
								<p data-text="muted">
									No text yet.
								</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionLensPostComments()}
					<LensCommentsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/lens')}
						entityFieldReference={{
							entityType: EntityType.LensPost,
							entityId,
							fieldName: '$$comments',
						}}
						id={`${postDetailKey}:comments`}
						open={true}
						title="Comments"
					/>
				{/snippet}

					{#snippet SectionLensPostRecord()}
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<LensPost_TimestampsView
							entityFieldReference={{
								entityType: EntityType.LensPost,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${postDetailKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}

					{#snippet SectionLensPostMore()}
						{#if routeChildren}
						{@render routeChildren()}
					{/if}
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
