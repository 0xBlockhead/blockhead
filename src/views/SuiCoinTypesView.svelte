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
	resource={
		selection({
			fields: {
				$icon: true,
				coinType: true,
				$network: true,
			},
		})
	}
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
							suiCoinTypeSelector.$network.$network.caip2 !== undefined ?
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
				{suiCoinTypeSelector.coinType || 'Sui coin type'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{suiCoinType.$network.$network.name || (suiCoinType.$network.$network.caip2 == null ? '' : `${suiCoinType.$network.$network.caip2.namespace}:${suiCoinType.$network.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
