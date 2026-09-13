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
	}: EntityListViewProps<EntityType.TonTrace_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTrace_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTraceTimestamp })}
		{@const tonTraceTimestampSelector = tonTraceTimestamp[EntityMetaKey.Selector]}
		{@const trace = tonTraceTimestampSelector.$trace}
		<EntityView
			entityType={EntityType.TonTrace_Timestamp}
			entitySelector={tonTraceTimestampSelector}
			href={
				trace.traceId !== undefined
				&& trace.$network !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trace/[traceId=stringSegment]/[traceSource=stringSegment]/(tonTrace)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								trace.$network.caip2 !== undefined ?
									caip2StringFromValue(trace.$network.caip2)
								:
									trace.$network.slug
							),
							traceId: trace.traceId,
							traceSource: trace.source,
							timestampMs: String(tonTraceTimestampSelector.timestampMs),
							source: tonTraceTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				TON trace timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
