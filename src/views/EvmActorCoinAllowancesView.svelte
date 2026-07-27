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
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance}
			entitySelector={evmActorCoinAllowanceSelector}
			href={
				(
					'caip2' in evmActorCoinAllowanceSelector.$contract.$network ?
						resolve(
							'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
							{
								chainId: String(evmActorCoinAllowanceSelector.$contract.$network.caip2.reference),
								owner: String(evmActorCoinAllowanceSelector.$actor.address),
								coin: String(evmActorCoinAllowanceSelector.$contract.address),
								spender: String(evmActorCoinAllowanceSelector.$spender.address),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{[(evmActorCoinAllowance.$contract.precompileName ?? ''), String(evmActorCoinAllowanceSelector.$contract.address)].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{String(evmActorCoinAllowanceSelector.$spender.address) || 'EVM account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
