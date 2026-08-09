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
		title = 'Allowance blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmActorCoinAllowance_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmActorCoinAllowance_Block}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					blockNumber: true,
					allowance: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmActorCoinAllowanceBlock })}
		{@const evmActorCoinAllowanceBlockSelector = evmActorCoinAllowanceBlock[EntityMetaKey.Selector]}
		{@const allowance = evmActorCoinAllowanceBlockSelector.$allowance}
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance_Block}
			entitySelector={evmActorCoinAllowanceBlockSelector}
			href={
				'caip2' in allowance.$contract.$network ?
					resolve(
						'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]/(evmActorCoinAllowance)/block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
						{
							chainId: allowance.$contract.$network.caip2.reference,
							owner: allowance.$actor.address,
							coin: allowance.$contract.address,
							spender: allowance.$spender.address,
							blockNumber: String(evmActorCoinAllowanceBlockSelector.blockNumber),
							source: evmActorCoinAllowanceBlockSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{'Block ' + evmActorCoinAllowanceBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{evmActorCoinAllowanceBlock.allowance}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmActorCoinAllowanceBlockSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
