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
	}: EntityListViewProps<EntityType.EvmNetworkActorCoinBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkActorCoinBalance}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				$actor: true,
				$coinInstance: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkActorCoinBalance })}
		{@const evmNetworkActorCoinBalanceSelector = evmNetworkActorCoinBalance[EntityMetaKey.Selector]}
		{@const contract = evmNetworkActorCoinBalanceSelector.$contract}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance}
			entitySelector={evmNetworkActorCoinBalanceSelector}
			href={
				contract !== undefined
				&& contract.$network.caip2 !== undefined ?
					resolve(
						'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
						{
							chainId: contract.$network.caip2.reference,
							owner: evmNetworkActorCoinBalanceSelector.$actor.address,
							coin: contract.address,
						}
					)
				:
					evmNetworkActorCoinBalanceSelector.$network !== undefined
					&& evmNetworkActorCoinBalanceSelector.$network.caip2 !== undefined ?
						resolve(
							'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native',
							{
								chainId: evmNetworkActorCoinBalanceSelector.$network.caip2.reference,
								owner: evmNetworkActorCoinBalanceSelector.$actor.address,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{evmNetworkActorCoinBalance.symbol || [evmNetworkActorCoinBalance.$coinInstance.NativeCurrency.symbol, (evmNetworkActorCoinBalance.$coinInstance.NativeCurrency.name ?? ''), evmNetworkActorCoinBalance.$coinInstance.Erc20Token.symbol, (evmNetworkActorCoinBalance.$coinInstance.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkActorCoinBalanceSelector.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkActorCoinBalanceSelector.$actor.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
