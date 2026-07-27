<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			fields: {
				$block: true,
				balance: true,
				usdValue: true,
				$actorCoin: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkActorCoinBalanceEvmBlock })}
		{@const evmNetworkActorCoinBalanceEvmBlockSelector = evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
			entitySelector={evmNetworkActorCoinBalanceEvmBlockSelector}
		>
			{#snippet Title()}
				{((String(evmNetworkActorCoinBalanceEvmBlockSelector.$block.blockNumber ?? '') ? 'Block #' + String(evmNetworkActorCoinBalanceEvmBlockSelector.$block.blockNumber ?? '') : '') || String(evmNetworkActorCoinBalanceEvmBlockSelector.$block.hash ?? '') || 'EVM block')}
			{/snippet}

			{#snippet Value()}
				{[(String(evmNetworkActorCoinBalanceEvmBlock.balance) ? String(evmNetworkActorCoinBalanceEvmBlock.balance) + evmNetworkActorCoinBalanceEvmBlockSelector.$actorCoin.symbol : ''), String(evmNetworkActorCoinBalanceEvmBlock.usdValue ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkActorCoinBalanceEvmBlock.$actorCoin.symbol || [String(evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.NativeCurrency.symbol ?? ''), String(evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.NativeCurrency.name ?? ''), String(evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.Erc20Token.symbol ?? ''), String(evmNetworkActorCoinBalanceEvmBlock.$actorCoin.$coinInstance.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
