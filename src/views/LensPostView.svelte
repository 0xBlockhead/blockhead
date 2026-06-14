<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		routeChildren,
		selector,
		href = resolve('/(social)/(lens)/lens/post/[postId]', {
			postId: selector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			routeChildren?: Snippet
			selector: EntitySelector<typeof schema, EntityType.LensPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const lensPost = subscribe(EntityType.LensPost,
		selector,
		({ sources: [
				Source.Lens_Graphql,
			], fields: { text: true, timestamp: true, isEdited: true, isDeleted: true, commentCount: true, repostCount: true, quoteCount: true, bookmarkCount: true, collectCount: true, reactionCount: true, $$timestamps: ({ sources: [
					Source.Lens_Graphql,
				], limit: 1 }), $author: true, $commentOn: true, $quoteOf: true, $repostOf: true, $root: true } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			startLength={24}
			endLength={12}
			value={selector.id}
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
						lensPost.fields.text
							? lensPost.fields.text
						:
							selector.id
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
				{#if lensPost.fields.timestamp != null}
					<span data-text="muted">
						<Timestamp
							timestamp={lensPost.fields.timestamp}
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
				{#if lensPost.fields.text != null && lensPost.fields.text !== ''}
					<p>
						<TruncatedValue
							value={lensPost.fields.text}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if lensPost.fields.timestamp != null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={lensPost.fields.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									selector={lensPost.fields.$author[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.$repostOf}
						<div>
							<dt>Repost of</dt>
							<dd>
							<svelte:self
								selector={lensPost.fields.$repostOf[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
								open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.$quoteOf}
						<div>
							<dt>Quote of</dt>
							<dd>
							<svelte:self
								selector={lensPost.fields.$quoteOf[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
								open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.$commentOn}
						<div>
							<dt>Comment on</dt>
							<dd>
							<svelte:self
								selector={lensPost.fields.$commentOn[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
								open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.isEdited === true}
						<div>
							<dt>Edited</dt>
							<dd>Yes</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.fields.isDeleted === true}
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
									value: lensPost.fields.$$timestamps[0]?.commentCount ?? lensPost.fields.commentCount,
								},
								{
									label: 'Reposts',
									value: lensPost.fields.$$timestamps[0]?.repostCount ?? lensPost.fields.repostCount,
								},
								{
									label: 'Quotes',
									value: lensPost.fields.$$timestamps[0]?.quoteCount ?? lensPost.fields.quoteCount,
								},
								{
									label: 'Bookmarks',
									value: lensPost.fields.$$timestamps[0]?.bookmarkCount ?? lensPost.fields.bookmarkCount,
								},
								{
									label: 'Collects',
									value: lensPost.fields.$$timestamps[0]?.collectCount ?? lensPost.fields.collectCount,
								},
								{
									label: 'Reactions',
									value: lensPost.fields.$$timestamps[0]?.reactionCount ?? lensPost.fields.reactionCount,
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
		{@const postDetailKey = stringify(selector)}
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
						{#if lensPost.fields.text}
							<p>{lensPost.fields.text}</p>
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
						selector,
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
						selector,
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
