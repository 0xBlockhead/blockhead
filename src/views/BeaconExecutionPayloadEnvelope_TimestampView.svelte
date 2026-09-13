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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconExecutionPayloadEnvelope_Timestamp>, 'prefetched'> = $props()

	const beaconExecutionPayloadEnvelopeTimestamp = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
		fields: {
			finalized: true,
			executionOptimistic: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BeaconExecutionPayloadEnvelopeView from '$/views/BeaconExecutionPayloadEnvelopeView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconExecutionPayloadEnvelope_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						selection.entitySelector.$envelope.$beaconBlock.$network.caip2 !== undefined ?
							caip2StringFromValue(selection.entitySelector.$envelope.$beaconBlock.$network.caip2)
						:
							selection.entitySelector.$envelope.$beaconBlock.$network.slug
					),
					root: selection.entitySelector.$envelope.$beaconBlock.root,
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
		<ResourceBoundary resource={beaconExecutionPayloadEnvelopeTimestamp}>
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
				<dt>Envelope</dt>
				<dd>
					<BeaconExecutionPayloadEnvelopeView
						selection={select(EntityType.BeaconExecutionPayloadEnvelope, selection.entitySelector.$envelope)}
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
				<dt>Execution optimistic</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadEnvelopeTimestamp}
					>
						{#snippet children(entity)}
							{entity.executionOptimistic ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadEnvelopeTimestamp}
					>
						{#snippet children(entity)}
							{entity.finalized ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
