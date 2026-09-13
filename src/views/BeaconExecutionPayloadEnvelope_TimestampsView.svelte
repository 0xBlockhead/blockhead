<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconExecutionPayloadEnvelope_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionPayloadEnvelope_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				finalized: true,
				executionOptimistic: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconExecutionPayloadEnvelopeTimestamp })}
		{@const beaconExecutionPayloadEnvelopeTimestampSelector = beaconExecutionPayloadEnvelopeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconExecutionPayloadEnvelope_Timestamp}
			entitySelector={beaconExecutionPayloadEnvelopeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							beaconExecutionPayloadEnvelopeTimestampSelector.$envelope.$beaconBlock.$network.caip2 !== undefined ?
								caip2StringFromValue(beaconExecutionPayloadEnvelopeTimestampSelector.$envelope.$beaconBlock.$network.caip2)
							:
								beaconExecutionPayloadEnvelopeTimestampSelector.$envelope.$beaconBlock.$network.slug
						),
						root: beaconExecutionPayloadEnvelopeTimestampSelector.$envelope.$beaconBlock.root,
						timestampMs: String(beaconExecutionPayloadEnvelopeTimestampSelector.timestampMs),
						source: beaconExecutionPayloadEnvelopeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{beaconExecutionPayloadEnvelopeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(beaconExecutionPayloadEnvelopeTimestamp.finalized), String(beaconExecutionPayloadEnvelopeTimestamp.executionOptimistic)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconExecutionPayloadEnvelopeTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
