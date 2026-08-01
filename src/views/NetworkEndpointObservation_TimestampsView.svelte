<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				timestampMs: true,
				health: true,
				latencyMs: true,
				endpointKind: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: networkEndpointObservationTimestamp })}
		{@const networkEndpointObservationTimestampSelector = networkEndpointObservationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NetworkEndpointObservation_Timestamp}
			entitySelector={networkEndpointObservationTimestampSelector}
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
