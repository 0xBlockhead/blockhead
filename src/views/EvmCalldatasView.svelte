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
	}: EntityListViewProps<EntityType.EvmCalldata> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmCalldata}
	bind:open
	resource={
		selection({
			fields: {
				hex: true,
			},
		})
	}
>
	{#snippet Item({ item: evmCalldata })}
		{@const evmCalldataSelector = evmCalldata[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmCalldata}
			entitySelector={evmCalldataSelector}
			href={
				resolve(
					'/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]',
					{
						hex: evmCalldataSelector.hex,
					}
				)
			}
		>
			{#snippet Title()}
				{evmCalldataSelector.hex || 'EVM calldata'}
			{/snippet}

			{#snippet Value()}
				{evmCalldataSelector.hex}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
