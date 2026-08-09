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
	}: EntityListViewProps<EntityType.NetworkEndpointObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkEndpointObservation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					health: true,
					latencyMs: true,
					endpointKind: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: networkEndpointObservationTimestamp })}
		{@const networkEndpointObservationTimestampSelector = networkEndpointObservationTimestamp[EntityMetaKey.Selector]}
		{@const network = networkEndpointObservationTimestampSelector.$network}
		<EntityView
			entityType={EntityType.NetworkEndpointObservation_Timestamp}
			entitySelector={networkEndpointObservationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/endpoint/[endpointUrl=stringSegment]/[endpointKind=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						endpointUrl: networkEndpointObservationTimestampSelector.endpointUrl,
						endpointKind: networkEndpointObservationTimestampSelector.endpointKind,
						timestampMs: String(networkEndpointObservationTimestampSelector.timestampMs),
						source: networkEndpointObservationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{networkEndpointObservationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(networkEndpointObservationTimestamp.health ?? ''), String(networkEndpointObservationTimestamp.latencyMs ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[networkEndpointObservationTimestampSelector.endpointKind, networkEndpointObservationTimestampSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
