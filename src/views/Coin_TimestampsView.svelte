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
	}: EntityListViewProps<EntityType.Coin_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Coin_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$coin: true,
					marketCap: true,
					marketCapUsd: true,
					change24hPercent: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: coinTimestamp })}
		{@const coinTimestampSelector = coinTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Coin_Timestamp}
			entitySelector={coinTimestampSelector}
			href={
				resolve(
					'/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						coinId: coinTimestampSelector.$coin.coinId,
						timestampMs: String(coinTimestampSelector.timestampMs),
						source: coinTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[coinTimestamp.$coin.symbol, coinTimestamp.$coin.name].filter(Boolean).join(' ') || 'Coin'}
			{/snippet}

			{#snippet Value()}
				{[String(coinTimestamp.marketCap ?? ''), String(coinTimestamp.marketCapUsd ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{coinTimestamp.change24hPercent != null ? coinTimestamp.change24hPercent + '%' : ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
