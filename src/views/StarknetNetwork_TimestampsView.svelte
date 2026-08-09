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
	}: EntityListViewProps<EntityType.StarknetNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
					timestampMs: true,
					latestBlockNumber: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: starknetNetworkTimestamp })}
		{@const starknetNetworkTimestampSelector = starknetNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetNetwork_Timestamp}
			entitySelector={starknetNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in starknetNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(starknetNetworkTimestampSelector.$network.$network.caip2)
							:
								starknetNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(starknetNetworkTimestampSelector.timestampMs),
						source: starknetNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetNetworkTimestamp.$network.$network.name || `${starknetNetworkTimestamp.$network.$network.caip2.namespace}:${starknetNetworkTimestamp.$network.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet Value()}
				{starknetNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetNetworkTimestamp.latestBlockNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
