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
	}: EntityListViewProps<EntityType.CardanoStakePool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakePool_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoStakePoolTimestamp })}
		{@const cardanoStakePoolTimestampSelector = cardanoStakePoolTimestamp[EntityMetaKey.Selector]}
		{@const pool = cardanoStakePoolTimestampSelector.$pool}
		<EntityView
			entityType={EntityType.CardanoStakePool_Timestamp}
			entitySelector={cardanoStakePoolTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]/(cardanoStakePool)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							pool.$network.caip2 !== undefined ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						epoch: String(cardanoStakePoolTimestampSelector.epoch),
						source: cardanoStakePoolTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano stake pool timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
