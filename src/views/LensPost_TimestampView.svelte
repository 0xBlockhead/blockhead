<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LensPost_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lens_Graphql,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Lens post observation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LensPostView
			selection={select(EntityType.LensPost, selection.entitySelector.$post)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Post</dt>
				<dd>
					<LensPostView
						selection={select(EntityType.LensPost, selection.entitySelector.$post)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							commentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commentCount = entity.commentCount}
					{#if commentCount != null}
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
					viewSelection({
						fields: {
							repostCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const repostCount = entity.repostCount}
					{#if repostCount != null}
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
					viewSelection({
						fields: {
							quoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteCount = entity.quoteCount}
					{#if quoteCount != null}
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
					viewSelection({
						fields: {
							bookmarkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bookmarkCount = entity.bookmarkCount}
					{#if bookmarkCount != null}
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
					viewSelection({
						fields: {
							collectCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collectCount = entity.collectCount}
					{#if collectCount != null}
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
					viewSelection({
						fields: {
							reactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reactionCount = entity.reactionCount}
					{#if reactionCount != null}
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
