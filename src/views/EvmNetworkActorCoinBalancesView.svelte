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
				$contract: true,
				symbol: true,
				$actor: true,
				$coinInstance: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkActorCoinBalance })}
		{@const evmNetworkActorCoinBalanceSelector = evmNetworkActorCoinBalance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance}
			entitySelector={evmNetworkActorCoinBalanceSelector}
			href={
				(
					evmNetworkActorCoinBalance.$contract != null
					&& evmNetworkActorCoinBalance.$contract.$network != null
					&& evmNetworkActorCoinBalance.$contract.$network.caip2 != null
					&& evmNetworkActorCoinBalance.$contract.$network.caip2.reference != null ?
						resolve(
							'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
							{
								chainId: String(evmNetworkActorCoinBalance.$contract.$network.caip2.reference),
								owner: String(evmNetworkActorCoinBalance.$actor.address),
								coin: String(evmNetworkActorCoinBalance.$contract.address),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{evmNetworkActorCoinBalance.symbol || [String(evmNetworkActorCoinBalance.$coinInstance.NativeCurrency.symbol ?? ''), String(evmNetworkActorCoinBalance.$coinInstance.NativeCurrency.name ?? ''), String(evmNetworkActorCoinBalance.$coinInstance.Erc20Token.symbol ?? ''), String(evmNetworkActorCoinBalance.$coinInstance.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
			{/snippet}

			{#snippet Value()}
				{String(evmNetworkActorCoinBalanceSelector.$actor.address) || 'EVM account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(evmNetworkActorCoinBalanceSelector.$actor.address) || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
