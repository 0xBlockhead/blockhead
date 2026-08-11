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
	}: EntityListViewProps<EntityType.SuiRegulatedCoinState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					source: true,
					$coinType: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: suiRegulatedCoinStateTimestamp })}
		{@const suiRegulatedCoinStateTimestampSelector = suiRegulatedCoinStateTimestamp[EntityMetaKey.Selector]}
		{@const coinType = suiRegulatedCoinStateTimestampSelector.$coinType}
		<EntityView
			entityType={EntityType.SuiRegulatedCoinState_Timestamp}
			entitySelector={suiRegulatedCoinStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]/(suiCoinType)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in coinType.$network.$network ?
								caip2StringFromValue(coinType.$network.$network.caip2)
							:
								coinType.$network.$network.slug
						),
						coinType: coinType.coinType,
						timestampMs: String(suiRegulatedCoinStateTimestampSelector.timestampMs),
						source: suiRegulatedCoinStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{suiRegulatedCoinStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{suiRegulatedCoinStateTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{suiRegulatedCoinStateTimestampSelector.$coinType.coinType || 'Sui coin type'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
