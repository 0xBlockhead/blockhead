<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LensPost_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LensPost_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const lensPostTimestamp = $derived(selection({
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			commentCount: true,
			repostCount: true,
			quoteCount: true,
			bookmarkCount: true,
			collectCount: true,
			reactionCount: true,
		},
	}))
	const titleFallback = $derived('Lens post observation')
	const viewDomId = $derived('lens-post-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<LensPostView
				selection={select(EntityType.LensPost, selection.entitySelector.$post)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					<LensPostView
						selection={select(EntityType.LensPost, selection.entitySelector.$post)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<LensPostView
						selection={select(EntityType.LensPost, selection.entitySelector.$post)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const commentCount = prefetched.commentCount ?? selection.entitySelector.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue value={Number(commentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const commentCount = entity.commentCount ?? selection.entitySelector.commentCount ?? prefetched.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue value={Number(commentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const repostCount = prefetched.repostCount ?? selection.entitySelector.repostCount}
					{#if repostCount !== undefined && repostCount !== null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue value={Number(repostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const repostCount = entity.repostCount ?? selection.entitySelector.repostCount ?? prefetched.repostCount}
					{#if repostCount !== undefined && repostCount !== null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue value={Number(repostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const quoteCount = prefetched.quoteCount ?? selection.entitySelector.quoteCount}
					{#if quoteCount !== undefined && quoteCount !== null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue value={Number(quoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const quoteCount = entity.quoteCount ?? selection.entitySelector.quoteCount ?? prefetched.quoteCount}
					{#if quoteCount !== undefined && quoteCount !== null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue value={Number(quoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const bookmarkCount = prefetched.bookmarkCount ?? selection.entitySelector.bookmarkCount}
					{#if bookmarkCount !== undefined && bookmarkCount !== null}
						<div>
							<dt>Bookmarks</dt>
							<dd>
								<NumberValue value={Number(bookmarkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const bookmarkCount = entity.bookmarkCount ?? selection.entitySelector.bookmarkCount ?? prefetched.bookmarkCount}
					{#if bookmarkCount !== undefined && bookmarkCount !== null}
						<div>
							<dt>Bookmarks</dt>
							<dd>
								<NumberValue value={Number(bookmarkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const collectCount = prefetched.collectCount ?? selection.entitySelector.collectCount}
					{#if collectCount !== undefined && collectCount !== null}
						<div>
							<dt>Collects</dt>
							<dd>
								<NumberValue value={Number(collectCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const collectCount = entity.collectCount ?? selection.entitySelector.collectCount ?? prefetched.collectCount}
					{#if collectCount !== undefined && collectCount !== null}
						<div>
							<dt>Collects</dt>
							<dd>
								<NumberValue value={Number(collectCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet Pending()}
					{@const reactionCount = prefetched.reactionCount ?? selection.entitySelector.reactionCount}
					{#if reactionCount !== undefined && reactionCount !== null}
						<div>
							<dt>Reactions</dt>
							<dd>
								<NumberValue value={Number(reactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reactionCount = entity.reactionCount ?? selection.entitySelector.reactionCount ?? prefetched.reactionCount}
					{#if reactionCount !== undefined && reactionCount !== null}
						<div>
							<dt>Reactions</dt>
							<dd>
								<NumberValue value={Number(reactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
