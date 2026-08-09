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
	}: EntityListViewProps<EntityType.SuiCoinType> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCoinType}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCoinType })}
		{@const suiCoinTypeSelector = suiCoinType[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiCoinType}
			entitySelector={suiCoinTypeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]',
					{
						network: (
							'caip2' in suiCoinTypeSelector.$network.$network ?
								caip2StringFromValue(suiCoinTypeSelector.$network.$network.caip2)
							:
								suiCoinTypeSelector.$network.$network.slug
						),
						coinType: suiCoinTypeSelector.coinType,
					}
				)
			}
		>
			{#snippet Title()}
				Sui coin type
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
