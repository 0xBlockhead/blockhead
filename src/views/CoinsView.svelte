<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A market-facing coin or crypto asset identity used across price, market, and network contexts.'],
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
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				$logo: true,
				symbol: true,
				name: true,
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
