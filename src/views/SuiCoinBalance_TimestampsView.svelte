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
	}: EntityListViewProps<EntityType.SuiCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCoinBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCoinBalanceTimestamp })}
		{@const suiCoinBalanceTimestampSelector = suiCoinBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = suiCoinBalanceTimestampSelector.$account}
		<EntityView
			entityType={EntityType.SuiCoinBalance_Timestamp}
			entitySelector={suiCoinBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/coin/[coinType=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						address: account.address,
						coinType: suiCoinBalanceTimestampSelector.coinType,
						timestampMs: String(suiCoinBalanceTimestampSelector.timestampMs),
						source: suiCoinBalanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Sui coin balance timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
