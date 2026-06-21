<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		routeChildren,
		selection,
		href = resolve('/(social)/(lens)/lens/post/[postId]', {
			postId: selection.entitySelector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			routeChildren?: Snippet
			selection: EntityProxyResource<typeof schema, EntityType.LensPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const lensPost = $derived(selection(
		{
			sources: [
				Source.Lens_Graphql,
			],
			fields: {
				text: true,
				timestamp: true,
				isEdited: true,
				isDeleted: true,
				$$timestamps: {
					sources: [
						Source.Lens_Graphql,
					],
					limit: 1,
				},
				$author: true,
				$commentOn: true,
				$quoteOf: true,
				$repostOf: true,
				$root: true,
			},
		},
	))


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
	import LensCommentsView from '$/views/LensCommentsView.svelte'
	import LensPost_TimestampsView from '$/views/LensPost_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			startLength={24}
			endLength={12}
			value={selection.entitySelector.id}
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
					value={
						lensPost.text
							? lensPost.text
						:
							selection.entitySelector.id
					}
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
									selection={select(EntityType.LensAccount, lensPost.$author[EntityMetaKey.Selector])}
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
							<LensPostView
								selection={select(EntityType.LensPost, lensPost.$repostOf[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							<LensPostView
								selection={select(EntityType.LensPost, lensPost.$quoteOf[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}

									showTypeAnnotation={false}
								
									open={false}
								
									/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && lensPost.$commentOn}
						<div>
							<dt>Comment on</dt>
							<dd>
							<LensPostView
								selection={select(EntityType.LensPost, lensPost.$commentOn[EntityMetaKey.Selector])}
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
									value: lensPost.$$timestamps?.values.at(0)?.commentCount,
								},
								{
									label: 'Reposts',
									value: lensPost.$$timestamps?.values.at(0)?.repostCount,
								},
								{
									label: 'Quotes',
									value: lensPost.$$timestamps?.values.at(0)?.quoteCount,
								},
								{
									label: 'Bookmarks',
									value: lensPost.$$timestamps?.values.at(0)?.bookmarkCount,
								},
								{
									label: 'Collects',
									value: lensPost.$$timestamps?.values.at(0)?.collectCount,
								},
								{
									label: 'Reactions',
									value: lensPost.$$timestamps?.values.at(0)?.reactionCount,
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
		{@const postDetailKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			id={`${postDetailKey}:carousel-lens-post`}
			sectionIdPrefix={postDetailKey}
			sections={
				routeChildren ?
						collapsibleTabsSections([
							{ id: 'lens-post-text', label: 'Text' },
							{ id: 'lens-post-comments', label: 'Comments' },
							{ id: 'metric-snapshots', label: 'Metrics' },
							{ id: 'lens-post-more', label: 'More' },
						])
				:
						collapsibleTabsSections([
							{ id: 'lens-post-text', label: 'Text' },
							{ id: 'lens-post-comments', label: 'Comments' },
							{ id: 'metric-snapshots', label: 'Metrics' },
						])
				}
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
					selection={selection.$$comments}
					id={`${postDetailKey}:comments`}
					open={true}
					title="Comments"
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<LensPost_TimestampsView
					selection={selection.$$timestamps}
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
