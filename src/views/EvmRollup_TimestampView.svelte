<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmRollup_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmRollup_Timestamp>>
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

	const evmRollupTimestamp = $derived(selection({
		fields: {
			listingStage: true,
			isArchived: true,
			isUpcoming: true,
			isUnderReview: true,
			sourceUpdatedAt: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp')
	const viewDomId = $derived('evm-rollup-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$rollup.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$rollup.$network.caip2.reference)}`,
			projectId: String(({ ...selection.entitySelector, ...prefetched }).$rollup.projectId),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
		{:else}
			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.listingStage) ?? ''), String((entity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
		{:else}
			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).listingStage) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.listingStage) ?? '')].filter(Boolean).join(' ') || [String((entity.listingStage) ?? ''), String((entity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmRollupView
					selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
					href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
							caip2: `${String(selection.entitySelector.$rollup.$network.caip2.namespace)}:${String(selection.entitySelector.$rollup.$network.caip2.reference)}`,
							projectId: String(selection.entitySelector.$rollup.projectId),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmRollupView
							selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
									caip2: `${String(selection.entitySelector.$rollup.$network.caip2.namespace)}:${String(selection.entitySelector.$rollup.$network.caip2.reference)}`,
									projectId: String(selection.entitySelector.$rollup.projectId),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmRollupView
							selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
									caip2: `${String(selection.entitySelector.$rollup.$network.caip2.namespace)}:${String(selection.entitySelector.$rollup.$network.caip2.reference)}`,
									projectId: String(selection.entitySelector.$rollup.projectId),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{@const isArchived = prefetched.isArchived ?? selection.entitySelector.isArchived}
					{#if isArchived !== undefined && isArchived !== null}
						<div>
							<dt>Archived</dt>
							<dd>
								{String((isArchived) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isArchived = entity.isArchived ?? selection.entitySelector.isArchived ?? prefetched.isArchived}
					{#if isArchived !== undefined && isArchived !== null}
						<div>
							<dt>Archived</dt>
							<dd>
								{String((isArchived) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{@const isUpcoming = prefetched.isUpcoming ?? selection.entitySelector.isUpcoming}
					{#if isUpcoming !== undefined && isUpcoming !== null}
						<div>
							<dt>Upcoming</dt>
							<dd>
								{String((isUpcoming) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isUpcoming = entity.isUpcoming ?? selection.entitySelector.isUpcoming ?? prefetched.isUpcoming}
					{#if isUpcoming !== undefined && isUpcoming !== null}
						<div>
							<dt>Upcoming</dt>
							<dd>
								{String((isUpcoming) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{@const isUnderReview = prefetched.isUnderReview ?? selection.entitySelector.isUnderReview}
					{#if isUnderReview !== undefined && isUnderReview !== null}
						<div>
							<dt>Under review</dt>
							<dd>
								{String((isUnderReview) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isUnderReview = entity.isUnderReview ?? selection.entitySelector.isUnderReview ?? prefetched.isUnderReview}
					{#if isUnderReview !== undefined && isUnderReview !== null}
						<div>
							<dt>Under review</dt>
							<dd>
								{String((isUnderReview) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmRollupTimestamp}>
				{#snippet Pending()}
					{@const sourceUpdatedAt = prefetched.sourceUpdatedAt ?? selection.entitySelector.sourceUpdatedAt}
					{#if sourceUpdatedAt !== undefined && sourceUpdatedAt !== null}
						<div>
							<dt>Source updated at</dt>
							<dd>
								<Timestamp timestamp={Number(sourceUpdatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceUpdatedAt = entity.sourceUpdatedAt ?? selection.entitySelector.sourceUpdatedAt ?? prefetched.sourceUpdatedAt}
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
					<ResourceBoundary resource={evmRollupTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
