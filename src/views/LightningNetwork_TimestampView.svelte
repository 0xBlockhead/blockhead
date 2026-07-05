<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningNetwork_Timestamp>>
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
	const lightningNetworkTimestamp = $derived(selection({
		fields: {
			nodeCount: true,
			channelCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning network timestamp')
	const viewDomId = $derived('lightning-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.nodeCount) ?? ''), String((prefetched.channelCount) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeCount) ?? ''), String((resolvedEntity.channelCount) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Lightning network</dt>
				<dd>
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$lightningNetwork)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							totalCapacitySats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalCapacitySats = prefetched.totalCapacitySats}
					{#if totalCapacitySats !== undefined && totalCapacitySats !== null}
						<div>
							<dt>Total capacity sats</dt>
							<dd>
								{String((totalCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalCapacitySats = resolvedEntity.totalCapacitySats}
					{#if totalCapacitySats !== undefined && totalCapacitySats !== null}
						<div>
							<dt>Total capacity sats</dt>
							<dd>
								{String((totalCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							torNodeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const torNodeCount = prefetched.torNodeCount}
					{#if torNodeCount !== undefined && torNodeCount !== null}
						<div>
							<dt>Tor nodes</dt>
							<dd>
								{String((torNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const torNodeCount = resolvedEntity.torNodeCount}
					{#if torNodeCount !== undefined && torNodeCount !== null}
						<div>
							<dt>Tor nodes</dt>
							<dd>
								{String((torNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							clearnetNodeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clearnetNodeCount = prefetched.clearnetNodeCount}
					{#if clearnetNodeCount !== undefined && clearnetNodeCount !== null}
						<div>
							<dt>Clearnet nodes</dt>
							<dd>
								{String((clearnetNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clearnetNodeCount = resolvedEntity.clearnetNodeCount}
					{#if clearnetNodeCount !== undefined && clearnetNodeCount !== null}
						<div>
							<dt>Clearnet nodes</dt>
							<dd>
								{String((clearnetNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							unannouncedNodeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unannouncedNodeCount = prefetched.unannouncedNodeCount}
					{#if unannouncedNodeCount !== undefined && unannouncedNodeCount !== null}
						<div>
							<dt>Unannounced nodes</dt>
							<dd>
								{String((unannouncedNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unannouncedNodeCount = resolvedEntity.unannouncedNodeCount}
					{#if unannouncedNodeCount !== undefined && unannouncedNodeCount !== null}
						<div>
							<dt>Unannounced nodes</dt>
							<dd>
								{String((unannouncedNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							averageCapacitySats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const averageCapacitySats = prefetched.averageCapacitySats}
					{#if averageCapacitySats !== undefined && averageCapacitySats !== null}
						<div>
							<dt>Average capacity sats</dt>
							<dd>
								{String((averageCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const averageCapacitySats = resolvedEntity.averageCapacitySats}
					{#if averageCapacitySats !== undefined && averageCapacitySats !== null}
						<div>
							<dt>Average capacity sats</dt>
							<dd>
								{String((averageCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							medianCapacitySats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const medianCapacitySats = prefetched.medianCapacitySats}
					{#if medianCapacitySats !== undefined && medianCapacitySats !== null}
						<div>
							<dt>Median capacity sats</dt>
							<dd>
								{String((medianCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const medianCapacitySats = resolvedEntity.medianCapacitySats}
					{#if medianCapacitySats !== undefined && medianCapacitySats !== null}
						<div>
							<dt>Median capacity sats</dt>
							<dd>
								{String((medianCapacitySats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							averageFeeRatePpm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const averageFeeRatePpm = prefetched.averageFeeRatePpm}
					{#if averageFeeRatePpm !== undefined && averageFeeRatePpm !== null}
						<div>
							<dt>Average fee rate ppm</dt>
							<dd>
								{String((averageFeeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const averageFeeRatePpm = resolvedEntity.averageFeeRatePpm}
					{#if averageFeeRatePpm !== undefined && averageFeeRatePpm !== null}
						<div>
							<dt>Average fee rate ppm</dt>
							<dd>
								{String((averageFeeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							medianFeeRatePpm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const medianFeeRatePpm = prefetched.medianFeeRatePpm}
					{#if medianFeeRatePpm !== undefined && medianFeeRatePpm !== null}
						<div>
							<dt>Median fee rate ppm</dt>
							<dd>
								{String((medianFeeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const medianFeeRatePpm = resolvedEntity.medianFeeRatePpm}
					{#if medianFeeRatePpm !== undefined && medianFeeRatePpm !== null}
						<div>
							<dt>Median fee rate ppm</dt>
							<dd>
								{String((medianFeeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
