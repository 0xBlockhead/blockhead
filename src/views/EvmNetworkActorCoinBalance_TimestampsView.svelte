<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Balance observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmNetworkActorCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				balance: true,
				usdValue: true,
				blockNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkActorCoinBalanceTimestamp })}
		{@const evmNetworkActorCoinBalanceTimestampSelector = evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
			entitySelector={evmNetworkActorCoinBalanceTimestampSelector}
		>
			{#snippet Title()}
				{evmNetworkActorCoinBalanceTimestampSelector.source || 'EVM network actor coin balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(evmNetworkActorCoinBalanceTimestamp.balance != null ? String(evmNetworkActorCoinBalanceTimestamp.balance) + evmNetworkActorCoinBalanceTimestampSelector.$actorCoin.symbol : ''), String(evmNetworkActorCoinBalanceTimestamp.usdValue ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkActorCoinBalanceTimestamp.blockNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
