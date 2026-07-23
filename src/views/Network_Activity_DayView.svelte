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
			selection: RegisteredEntityProxyResource<EntityType.Network_Activity_Day>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Network_Activity_Day>
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
	const networkActivityDay = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			transactionCount: true,
			trustModel: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			transactionCount: true,
			trustModel: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.dayStartTimestampMs) ?? '')].filter(Boolean).join(' ') || 'network activity day')
	const viewDomId = $derived('network-activity-day-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Activity_Day}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.source === 'SpaceAndTime_MakeInfinite'
			&& selection.entitySelector != null && 'dayStartTimestampMs' in selection.entitySelector
			&& selection.entitySelector.dayStartTimestampMs != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
				dayStartTimestampMs: String(selection.entitySelector.dayStartTimestampMs ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
					dayStartTimestampMs: String(selection.entitySelector.dayStartTimestampMs ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transactionCount') && Object.hasOwn(prefetched, 'trustModel')}
			{@const dayStartTimestampMs0 = pendingEntity.dayStartTimestampMs}
			{#if dayStartTimestampMs0 !== undefined && dayStartTimestampMs0 !== null}
				<Timestamp timestamp={Number(dayStartTimestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={networkActivityDay}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dayStartTimestampMs0 = resolvedEntity.dayStartTimestampMs}
					{#if dayStartTimestampMs0 !== undefined && dayStartTimestampMs0 !== null}
						<Timestamp timestamp={Number(dayStartTimestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transactionCount') && Object.hasOwn(prefetched, 'trustModel')}
			{@const transactionCount0 = pendingEntity.transactionCount}
			{#if transactionCount0 !== undefined && transactionCount0 !== null}
				<NumberValue
					value={transactionCount0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={networkActivityDay}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount0 = resolvedEntity.transactionCount}
					{#if transactionCount0 !== undefined && transactionCount0 !== null}
						<NumberValue
							value={transactionCount0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transactionCount') && Object.hasOwn(prefetched, 'trustModel')}
			{@const trustModel0 = pendingEntity.trustModel}
			{#if trustModel0 !== undefined && trustModel0 !== null}
				<span data-text="muted">
					{String((trustModel0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={networkActivityDay}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const trustModel0 = resolvedEntity.trustModel}
					{#if trustModel0 !== undefined && trustModel0 !== null}
						<span data-text="muted">
							{String((trustModel0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A completed UTC day of provider-reported network activity aggregates.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
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

			<div>
				<dt>Day start</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									dayStartTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dayStartTimestampMs = resolvedEntity.dayStartTimestampMs}
							{#if dayStartTimestampMs !== undefined && dayStartTimestampMs !== null}
								<Timestamp timestamp={Number(dayStartTimestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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

			<div>
				<dt>Block count</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockCount = resolvedEntity.blockCount}
							{#if blockCount !== undefined && blockCount !== null}
								<NumberValue
									value={blockCount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transaction count</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionCount = resolvedEntity.transactionCount}
							{#if transactionCount !== undefined && transactionCount !== null}
								<NumberValue
									value={transactionCount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>End block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									endBlockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const endBlockNumber = resolvedEntity.endBlockNumber}
							{#if endBlockNumber !== undefined && endBlockNumber !== null}
								<NumberValue
									value={endBlockNumber}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Indexed through</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexedThroughTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexedThroughTimestampMs = resolvedEntity.indexedThroughTimestampMs}
							{#if indexedThroughTimestampMs !== undefined && indexedThroughTimestampMs !== null}
								<Timestamp timestamp={Number(indexedThroughTimestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Resolved at</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									resolvedAtMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const resolvedAtMs = resolvedEntity.resolvedAtMs}
							{#if resolvedAtMs !== undefined && resolvedAtMs !== null}
								<Timestamp timestamp={Number(resolvedAtMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Trust model</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									trustModel: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const trustModel = resolvedEntity.trustModel}
							{#if trustModel !== undefined && trustModel !== null}
								{String((trustModel) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
