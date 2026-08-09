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
	}: EntityListViewProps<EntityType.EvmAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmAccount}
	bind:open
	resource={
		selection({
			...{
				fields: {
					address: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmAccount })}
		{@const evmAccountSelector = evmAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmAccount}
			entitySelector={evmAccountSelector}
			href={
				'interopAddress' in evmAccountSelector ?
					resolve(
						'/evm/account/[address=evmAddress]/interop/[interopAddress=stringSegment]',
						{
							address: evmAccountSelector.address,
							interopAddress: evmAccountSelector.interopAddress,
						}
					)
				:
					resolve(
						'/(explore)/account/[address=evmAddress]',
						{
							address: evmAccountSelector.address,
						}
					)
			}
		>
			{#snippet Title()}
				{evmAccountSelector.address || 'EVM account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
