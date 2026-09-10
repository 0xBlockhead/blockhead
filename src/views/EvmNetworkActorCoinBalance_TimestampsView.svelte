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
		{@const actorCoin = evmNetworkActorCoinBalanceTimestampSelector.$actorCoin}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
			entitySelector={evmNetworkActorCoinBalanceTimestampSelector}
			href={
				'$contract' in actorCoin
				&& 'caip2' in actorCoin.$contract.$network ?
					resolve(
						'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/(evmNetworkActorCoinBalance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							chainId: actorCoin.$contract.$network.caip2.reference,
							owner: actorCoin.$actor.address,
							coin: actorCoin.$contract.address,
							timestampMs: String(evmNetworkActorCoinBalanceTimestampSelector.timestampMs),
							source: evmNetworkActorCoinBalanceTimestampSelector.source,
						}
					)
				:
					undefined
			}
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
