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
	}: EntitySelectionViewProps<EntityType.EvmNetwork_GasEstimate_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmNetworkGasEstimateTimestamp = $derived(selection({
		fields: {
			fastGwei: true,
		},
	}))
	const titleFallback = $derived(([(String(pendingEntity.fastGwei ?? '') ? String(pendingEntity.fastGwei ?? '') + ' gwei' : ''), String(pendingEntity.timestampMs ?? '')].filter(Boolean).join(' ')) || 'EVM network gas estimate timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkGasEstimateTimestamp}>
			{#snippet children(entity)}
				{([(String(entity.fastGwei ?? '') ? String(entity.fastGwei ?? '') + ' gwei' : ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ')) || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkGasEstimateTimestamp}>
			{#snippet children(entity)}
				{@const fastGwei0 = entity.fastGwei}
				{#if fastGwei0 != null}
					<NumberValue
						value={fastGwei0}
					/>

					<span> gwei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							slowGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slowGwei = entity.slowGwei}
					{#if slowGwei != null}
						<div>
							<dt>Slow</dt>
							<dd>
								<NumberValue
									value={slowGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							averageGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const averageGwei = entity.averageGwei}
					{#if averageGwei != null}
						<div>
							<dt>Average</dt>
							<dd>
								<NumberValue
									value={averageGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmNetworkGasEstimateTimestamp}
			>
				{#snippet children(entity)}
					{@const fastGwei = entity.fastGwei}
					{#if fastGwei != null}
						<div>
							<dt>Fast</dt>
							<dd>
								<NumberValue
									value={fastGwei}
								/>

								<span> gwei</span>
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
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transport = entity.transport}
					{#if transport != null}
						<div>
							<dt>Transport</dt>
							<dd>
								{transport}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
