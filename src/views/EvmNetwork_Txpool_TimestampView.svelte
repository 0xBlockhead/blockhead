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
	}: EntitySelectionViewProps<EntityType.EvmNetwork_Txpool_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmNetworkTxpoolTimestamp = $derived(selection({
		fields: {
			pendingCount: true,
			queuedCount: true,
		},
	}))
	const titleFallback = $derived(([(String(pendingEntity.pendingCount ?? '') ? String(pendingEntity.pendingCount ?? '') + ' pending' : ''), (String(pendingEntity.queuedCount ?? '') ? String(pendingEntity.queuedCount ?? '') + ' queued' : '')].filter(Boolean).join(' ')) || 'EVM network txpool timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
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
		<ResourceBoundary resource={evmNetworkTxpoolTimestamp}>
			{#snippet children(entity)}
				{([(String(entity.pendingCount) ? String(entity.pendingCount) + ' pending' : ''), (String(entity.queuedCount) ? String(entity.queuedCount) + ' queued' : '')].filter(Boolean).join(' ')) || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkTxpoolTimestamp}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.pendingCount}
				/>

				<span> pending</span>
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
			<div>
				<dt>Pending</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkTxpoolTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.pendingCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Queued</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkTxpoolTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.queuedCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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
