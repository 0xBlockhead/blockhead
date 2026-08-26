<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconDataColumn_Timestamp>, 'prefetched'> = $props()

	const dataColumn = $derived(selection.entitySelector.$dataColumn)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconDataColumnTimestamp = $derived(viewSelection({
		fields: {
			finalized: true,
			executionOptimistic: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconDataColumnView from '$/views/BeaconDataColumnView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconDataColumn_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/data-column/[columnIndex=nonNegativeInteger]/(beaconDataColumn)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in dataColumn.$block.$network ?
							caip2StringFromValue(dataColumn.$block.$network.caip2)
						:
							dataColumn.$block.$network.slug
					),
					root: dataColumn.$block.root,
					columnIndex: String(dataColumn.columnIndex),
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconDataColumnTimestamp}>
			{#snippet children(entity)}
				{[String(entity.finalized), String(entity.executionOptimistic)].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Data column</dt>
				<dd>
					<BeaconDataColumnView
						selection={select(EntityType.BeaconDataColumn, selection.entitySelector.$dataColumn)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Retrieved at</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Beacon endpoint</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									endpointUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<a
								href={entity.endpointUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.endpointUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDataColumnTimestamp}
					>
						{#snippet children(entity)}
							{entity.finalized ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution optimistic</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDataColumnTimestamp}
					>
						{#snippet children(entity)}
							{entity.executionOptimistic ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
