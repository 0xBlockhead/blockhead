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
	}: EntityListViewProps<EntityType.EvmActorCoinAllowance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmActorCoinAllowance}
	bind:open
	resource={
		selection({
			fields: {
				$contract: true,
				$spender: true,
			},
		})
	}
>
	{#snippet Item({ item: evmActorCoinAllowance })}
		{@const evmActorCoinAllowanceSelector = evmActorCoinAllowance[EntityMetaKey.Selector]}
		{@const contract = evmActorCoinAllowanceSelector.$contract}
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance}
			entitySelector={evmActorCoinAllowanceSelector}
			href={
				'caip2' in contract.$network ?
					resolve(
						'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
						{
							chainId: contract.$network.caip2.reference,
							owner: evmActorCoinAllowanceSelector.$actor.address,
							coin: contract.address,
							spender: evmActorCoinAllowanceSelector.$spender.address,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(evmActorCoinAllowance.$contract.precompileName ?? ''), evmActorCoinAllowanceSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{evmActorCoinAllowanceSelector.$spender.address || 'EVM account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
