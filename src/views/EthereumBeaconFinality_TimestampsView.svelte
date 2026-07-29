<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title = 'Finality',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EthereumBeaconFinality_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				finalizedCheckpointEpoch: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: ethereumBeaconFinalityTimestamp })}
		{@const ethereumBeaconFinalityTimestampSelector = ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector]}
		{@const network = ethereumBeaconFinalityTimestampSelector.$network}
		<EntityView
			entityType={EntityType.EthereumBeaconFinality_Timestamp}
			entitySelector={ethereumBeaconFinalityTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(ethereumBeaconFinalityTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{'Finalized epoch ' + ethereumBeaconFinalityTimestamp.finalizedCheckpointEpoch}
			{/snippet}

			{#snippet Value()}
				{ethereumBeaconFinalityTimestamp.finalizedCheckpointEpoch}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ethereumBeaconFinalityTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
