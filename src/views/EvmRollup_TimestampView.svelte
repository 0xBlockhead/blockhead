<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.EvmRollup_Timestamp> = $props()

	const rollup = $derived(selection.entitySelector.$rollup)
	const evmRollupTimestamp = $derived(selection({
		fields: {
			listingStage: true,
		},
	}))
	const titleFallback = $derived([(prefetched.listingStage ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM rollup timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in rollup.$network ?
							caip2StringFromValue(rollup.$network.caip2)
						:
							rollup.$network.slug
					),
					projectId: rollup.projectId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet children(entity)}
				{[(entity.listingStage ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet children(entity)}
				{(entity.listingStage ?? '') || [(entity.listingStage ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmRollupView
				selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmRollupTimestamp}
			>
				{#snippet children(entity)}
					{@const listingStage = entity.listingStage}
					{#if listingStage != null}
						<div>
							<dt>Listing stage</dt>
							<dd>
								{listingStage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isArchived: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isArchived = entity.isArchived}
					{#if isArchived != null}
						<div>
							<dt>Archived</dt>
							<dd>
								{isArchived ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isUpcoming: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isUpcoming = entity.isUpcoming}
					{#if isUpcoming != null}
						<div>
							<dt>Upcoming</dt>
							<dd>
								{isUpcoming ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isUnderReview: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isUnderReview = entity.isUnderReview}
					{#if isUnderReview != null}
						<div>
							<dt>Under review</dt>
							<dd>
								{isUnderReview ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceUpdatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceUpdatedAt = entity.sourceUpdatedAt}
					{#if sourceUpdatedAt != null}
						<div>
							<dt>Source updated at</dt>
							<dd>
								<Timestamp timestamp={sourceUpdatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Rollup</dt>
				<dd>
					<EvmRollupView
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
