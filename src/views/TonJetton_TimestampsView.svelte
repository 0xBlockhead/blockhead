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
	}: EntityListViewProps<EntityType.TonJetton_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJetton_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJettonTimestamp })}
		{@const tonJettonTimestampSelector = tonJettonTimestamp[EntityMetaKey.Selector]}
		{@const jetton = tonJettonTimestampSelector.$jetton}
		<EntityView
			entityType={EntityType.TonJetton_Timestamp}
			entitySelector={tonJettonTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton/[masterAddress=stringSegment]/(tonJetton)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							jetton.$network.caip2 !== undefined ?
								caip2StringFromValue(jetton.$network.caip2)
							:
								jetton.$network.slug
						),
						masterAddress: jetton.masterAddress,
						timestampMs: String(tonJettonTimestampSelector.timestampMs),
						source: tonJettonTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON jetton timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
