<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Coin> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Coin}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$logo: true,
					symbol: true,
					name: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: coin })}
		{@const coinSelector = coin[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Coin}
			entitySelector={coinSelector}
			href={
				resolve(
					'/(assets)/coin/[coinId=stringSegment]',
					{
						coinId: coinSelector.coinId,
					}
				)
			}
		>
			{#snippet Title()}
				{[coin.symbol, coin.name].filter(Boolean).join(' ') || 'Coin'}
			{/snippet}

			{#snippet Value()}
				{coin.symbol}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
