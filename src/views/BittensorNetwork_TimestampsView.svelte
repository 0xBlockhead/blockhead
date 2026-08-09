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
	}: EntityListViewProps<EntityType.BittensorNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					finalizedBlockNumber: true,
					runtimeSpecName: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bittensorNetworkTimestamp })}
		{@const bittensorNetworkTimestampSelector = bittensorNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = bittensorNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.BittensorNetwork_Timestamp}
			entitySelector={bittensorNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(bittensorNetworkTimestampSelector.timestampMs),
						source: bittensorNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bittensorNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bittensorNetworkTimestamp.finalizedBlockNumber ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bittensorNetworkTimestamp.runtimeSpecName ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
