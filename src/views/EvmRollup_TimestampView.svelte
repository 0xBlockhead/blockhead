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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EvmRollup_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmRollup_Timestamp>
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
	const evmRollupTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			listingStage: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			listingStage: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.listingStage) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp')
	const viewDomId = $derived('evm-rollup-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$rollup' in selection.entitySelector
			&& selection.entitySelector.$rollup != null && 'projectId' in selection.entitySelector.$rollup
			&& selection.entitySelector.$rollup.projectId != null
			&& selection.entitySelector.$rollup != null && '$network' in selection.entitySelector.$rollup ?
				selection.entitySelector.$rollup.$network != null && 'caip2' in selection.entitySelector.$rollup.$network
				&& selection.entitySelector.$rollup.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$rollup.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$rollup.$network != null && 'slug' in selection.entitySelector.$rollup.$network
					&& selection.entitySelector.$rollup.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
					network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.listingStage) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.listingStage) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.listingStage) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmRollupView
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
						href={
							(
								selection.entitySelector.$rollup != null && 'projectId' in selection.entitySelector.$rollup
								&& selection.entitySelector.$rollup.projectId != null
								&& selection.entitySelector.$rollup != null && '$network' in selection.entitySelector.$rollup ?
									selection.entitySelector.$rollup.$network != null && 'caip2' in selection.entitySelector.$rollup.$network
									&& selection.entitySelector.$rollup.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
									projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$rollup.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$rollup.$network != null && 'slug' in selection.entitySelector.$rollup.$network
										&& selection.entitySelector.$rollup.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
										projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
										network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							listingStage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listingStage = resolvedEntity.listingStage}
					{#if listingStage !== undefined && listingStage !== null}
						<div>
							<dt>Listing stage</dt>
							<dd>
								{String((listingStage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							isArchived: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isArchived = resolvedEntity.isArchived}
					{#if isArchived !== undefined && isArchived !== null}
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
						sources: selection.sources,
						fields: {
							isUpcoming: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isUpcoming = resolvedEntity.isUpcoming}
					{#if isUpcoming !== undefined && isUpcoming !== null}
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
						sources: selection.sources,
						fields: {
							isUnderReview: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isUnderReview = resolvedEntity.isUnderReview}
					{#if isUnderReview !== undefined && isUnderReview !== null}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourceUpdatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceUpdatedAt = resolvedEntity.sourceUpdatedAt}
					{#if sourceUpdatedAt !== undefined && sourceUpdatedAt !== null}
						<div>
							<dt>Source updated at</dt>
							<dd>
								<Timestamp timestamp={Number(sourceUpdatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Rollup</dt>
				<dd>
					<EvmRollupView
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
						href={
							(
								selection.entitySelector.$rollup != null && 'projectId' in selection.entitySelector.$rollup
								&& selection.entitySelector.$rollup.projectId != null
								&& selection.entitySelector.$rollup != null && '$network' in selection.entitySelector.$rollup ?
									selection.entitySelector.$rollup.$network != null && 'caip2' in selection.entitySelector.$rollup.$network
									&& selection.entitySelector.$rollup.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
									projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$rollup.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$rollup.$network != null && 'slug' in selection.entitySelector.$rollup.$network
										&& selection.entitySelector.$rollup.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
										projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
										network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
									})
									:
										undefined
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
	{/snippet}
</EntityView>
