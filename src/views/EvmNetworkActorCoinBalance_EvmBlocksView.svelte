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
		title = 'Balance blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmNetworkActorCoinBalance_EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$block: true,
					balance: true,
					usdValue: true,
					$actorCoin: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkActorCoinBalanceEvmBlock })}
		{@const evmNetworkActorCoinBalanceEvmBlockSelector = evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.Selector]}
		{@const actorCoin = evmNetworkActorCoinBalanceEvmBlockSelector.$actorCoin}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
			entitySelector={evmNetworkActorCoinBalanceEvmBlockSelector}
			href={
				'blockNumber' in evmNetworkActorCoinBalanceEvmBlockSelector.$block
				&& '$network' in actorCoin
				&& 'caip2' in actorCoin.$network ?
					resolve(
						'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native/(evmNetworkActorCoinBalance)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: actorCoin.$network.caip2.reference,
							owner: actorCoin.$actor.address,
							blockNumber: String(evmNetworkActorCoinBalanceEvmBlockSelector.$block.blockNumber),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{`Block #${evmNetworkActorCoinBalanceEvmBlock.$block.blockNumber}`}
			{/snippet}

			{#snippet Value()}
				{[String(evmNetworkActorCoinBalanceEvmBlock.balance) + evmNetworkActorCoinBalanceEvmBlockSelector.$actorCoin.symbol, String(evmNetworkActorCoinBalanceEvmBlock.usdValue ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkActorCoinBalanceEvmBlock.$actorCoin.symbol || [evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.NativeCurrency.symbol, (evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.NativeCurrency.name ?? ''), evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.Erc20Token.symbol, (evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
