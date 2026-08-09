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
	}: EntityListViewProps<EntityType.HyperliquidBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidBlock })}
		{@const hyperliquidBlockSelector = hyperliquidBlock[EntityMetaKey.Selector]}
		{@const network = hyperliquidBlockSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidBlock}
			entitySelector={hyperliquidBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						blockNumber: String(hyperliquidBlockSelector.height),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
