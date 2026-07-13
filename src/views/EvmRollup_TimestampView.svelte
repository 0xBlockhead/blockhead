<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmRollupTimestamp = $derived(selection({
		fields: {
			listingStage: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.listingStage) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp')
	const viewDomId = $derived('evm-rollup-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$rollup !== undefined && pendingEntity.$rollup.$network !== undefined && pendingEntity.$rollup.$network.slug !== undefined && pendingEntity.$rollup.projectId !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			network: String(pendingEntity.$rollup.$network.slug ?? ''),
			projectId: String(pendingEntity.$rollup.projectId ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.listingStage) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.listingStage) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.listingStage) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.listingStage) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.listingStage) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.listingStage) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmRollupTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmRollupView
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
						href={
							(selection.entitySelector.$rollup.$network !== undefined && selection.entitySelector.$rollup.$network.slug !== undefined && selection.entitySelector.$rollup.projectId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
								network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
								projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmRollupView
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup)}
						href={
							(selection.entitySelector.$rollup.$network !== undefined && selection.entitySelector.$rollup.$network.slug !== undefined && selection.entitySelector.$rollup.projectId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
								network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
								projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
							}) : undefined)
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
						fields: {
							listingStage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listingStage = pendingEntity.listingStage}
					{#if listingStage !== undefined && listingStage !== null}
						<div>
							<dt>Listing stage</dt>
							<dd>
								{String((listingStage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isArchived: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isArchived = pendingEntity.isArchived}
					{#if isArchived !== undefined && isArchived !== null}
						<div>
							<dt>Archived</dt>
							<dd>
								{isArchived ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isUpcoming: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isUpcoming = pendingEntity.isUpcoming}
					{#if isUpcoming !== undefined && isUpcoming !== null}
						<div>
							<dt>Upcoming</dt>
							<dd>
								{isUpcoming ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isUnderReview: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isUnderReview = pendingEntity.isUnderReview}
					{#if isUnderReview !== undefined && isUnderReview !== null}
						<div>
							<dt>Under review</dt>
							<dd>
								{isUnderReview ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
						fields: {
							sourceUpdatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceUpdatedAt = pendingEntity.sourceUpdatedAt}
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						selection={select(EntityType.EvmRollup, selection.entitySelector.$rollup, {})}
						href={
							(selection.entitySelector.$rollup.$network !== undefined && selection.entitySelector.$rollup.$network.slug !== undefined && selection.entitySelector.$rollup.projectId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
								network: String(selection.entitySelector.$rollup.$network.slug ?? ''),
								projectId: String(selection.entitySelector.$rollup.projectId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
