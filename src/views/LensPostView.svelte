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


	// Props
	let {
		routeChildren,
		entityId,
		href = resolve('/(social)/lens/post/[postId]', {
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
			$author: {},
			$commentOn: {},
			$quoteOf: {},
			$repostOf: {},
			$root: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensCommentsView from '$/views/LensCommentsView.svelte'
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 publications are on-chain posts keyed by slug; author profiles, comment threads, and engagement counts resolve from Lens GraphQL indexers.
		</p>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			placeholderText="Loading Lens publication…"
			resource={lensPost}
		>
			{#snippet children(loadedLensPost)}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					startLength={42}
					endLength={14}
					value={(
						lensPost.text
							? loadedLensPost.text
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
			{#snippet children(loadedLensPost)}
				{#if loadedLensPost.timestamp != null}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedLensPost.timestamp}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
			{#snippet children(loadedLensPost)}
				<dl data-column-item="center">
					{#if loadedLensPost.text != null && loadedLensPost.text !== ''}
						<div>
							<dt>Publication</dt>
							<dd>{loadedLensPost.text}</dd>
						</div>
					{/if}

					{#if loadedLensPost.timestamp != null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={loadedLensPost.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && loadedLensPost.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									entityId={loadedLensPost.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && loadedLensPost.$repostOf}
						<div>
							<dt>Repost of</dt>
							<dd>
								<LensPostView
									entityId={loadedLensPost.$repostOf[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && loadedLensPost.$quoteOf}
						<div>
							<dt>Quote of</dt>
							<dd>
								<LensPostView
									entityId={loadedLensPost.$quoteOf[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && loadedLensPost.$commentOn}
						<div>
							<dt>Comment on</dt>
							<dd>
								<LensPostView
									entityId={loadedLensPost.$commentOn[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && loadedLensPost.isEdited === true}
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

					{#if (
						contentOpen
						&& lensPost.commentCount != null
					)}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.commentCount}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						contentOpen
						&& lensPost.repostCount != null
					)}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.repostCount}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						contentOpen
						&& lensPost.quoteCount != null
					)}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.quoteCount}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						contentOpen
						&& lensPost.bookmarkCount != null
					)}
						<div>
							<dt>Bookmarks</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.bookmarkCount}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						contentOpen
						&& lensPost.collectCount != null
					)}
						<div>
							<dt>Collects</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.collectCount}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						contentOpen
						&& lensPost.reactionCount != null
					)}
						<div>
							<dt>Reactions</dt>
							<dd>
								<NumberValue
									value={loadedLensPost.reactionCount}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const postDetailKey = stringify(entityId)}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			{#if true}
				<CollapsibleTabs
					id={`${postDetailKey}:carousel-lens-post`}
					Summary={LensPublicationCarouselSummary}
					Markers={LensPublicationCarouselMarkers}
					body={LensPublicationCarouselBody}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				/>
				{#snippet LensPublicationCarouselSummary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Lens publication
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet LensPublicationCarouselMarkers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Text"
						href={`#${postDetailKey}:lens-post-text`}
					>Text</a>
					<a
						data-scroll-marker-label="Comments"
						href={`#${postDetailKey}:lens-post-comments`}
					>Comments</a>
					<a
						data-scroll-marker-label="Record"
						href={`#${postDetailKey}:lens-post-record`}
					>Record</a>
					{#if routeChildren}
						<a
							data-scroll-marker-label="More"
							href={`#${postDetailKey}:lens-post-more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet LensPublicationCarouselBody({ open: sectionOpen })}
					<section
						data-scroll-marker-label="Text"
						id={`${postDetailKey}:lens-post-text`}
					>
						<ResourceBoundary
							resource={lensPost}
							placeholderText="Loading Lens publication…"
						>
							{#snippet children(loadedLensPost)}
								{#if loadedLensPost.text}
									<p>{loadedLensPost.text}</p>
								{:else}
									<p data-text="muted">
										No text yet.
									</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<section
						data-scroll-marker-label="Comments"
						id={`${postDetailKey}:lens-post-comments`}
					>
						<LensCommentsView
							href={resolve('/lens')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.LensPost,
								entityId,
								fieldName: '$$comments',
							}}
							id={`${postDetailKey}:comments`}
							open={sectionOpen}
							title="Comments"
						/>
					</section>

					<section
						data-scroll-marker-label="Record"
						id={`${postDetailKey}:lens-post-record`}
					>
						<EntityDetails
							entityType={EntityType.LensPost}
							{entityId}
						/>
					</section>

					{#if routeChildren}
						<section
							data-scroll-marker-label="More"
							id={`${postDetailKey}:lens-post-more`}
						>
							{@render routeChildren()}
						</section>
					{/if}
				{/snippet}
			{/if}
		</div>
	{/snippet}
</EntityView>

