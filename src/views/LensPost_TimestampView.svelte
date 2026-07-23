<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.LensPost_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LensPost_Timestamp>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const lensPostTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'Lens post observation'
	const viewDomId = $derived('lens-post-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && '$post' in selection.entitySelector
			&& selection.entitySelector.$post != null && 'id' in selection.entitySelector.$post
			&& selection.entitySelector.$post.id != null ?
				resolve('/lens/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			postId: String(selection.entitySelector.$post.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$post') && prefetched.$post != null && Object.hasOwn(prefetched.$post, 'text') && Object.hasOwn(prefetched.$post, 'timestamp')}
			{@const lensPost0 = pendingEntity.$post}
			{#if lensPost0 != null && selection.entitySelector.$post != null}
				<LensPostView
					selection={select(EntityType.LensPost, selection.entitySelector.$post, { sources: selection.sources })}
					prefetched={lensPost0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet children(entity)}
					<LensPostView
						selection={select(EntityType.LensPost, selection.entitySelector.$post)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$post') && prefetched.$post != null && Object.hasOwn(prefetched.$post, 'text') && Object.hasOwn(prefetched.$post, 'timestamp')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={lensPostTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Post</dt>
				<dd>
					<LensPostView
						selection={select(EntityType.LensPost, selection.entitySelector.$post)}
						href={
							(
								selection.entitySelector.$post != null && 'id' in selection.entitySelector.$post
								&& selection.entitySelector.$post.id != null ?
									resolve('/lens/post/[postId=stringSegment]', {
								postId: String(selection.entitySelector.$post.id ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							commentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commentCount = resolvedEntity.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue
									value={commentCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							repostCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const repostCount = resolvedEntity.repostCount}
					{#if repostCount !== undefined && repostCount !== null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue
									value={repostCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteCount = resolvedEntity.quoteCount}
					{#if quoteCount !== undefined && quoteCount !== null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue
									value={quoteCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							bookmarkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bookmarkCount = resolvedEntity.bookmarkCount}
					{#if bookmarkCount !== undefined && bookmarkCount !== null}
						<div>
							<dt>Bookmarks</dt>
							<dd>
								<NumberValue
									value={bookmarkCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							collectCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const collectCount = resolvedEntity.collectCount}
					{#if collectCount !== undefined && collectCount !== null}
						<div>
							<dt>Collects</dt>
							<dd>
								<NumberValue
									value={collectCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							reactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reactionCount = resolvedEntity.reactionCount}
					{#if reactionCount !== undefined && reactionCount !== null}
						<div>
							<dt>Reactions</dt>
							<dd>
								<NumberValue
									value={reactionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
