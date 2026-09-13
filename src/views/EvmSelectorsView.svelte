<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmSelector> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmSelector}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
				Source.FourByteDirectory_Rest,
			],
			fields: {
				hex: true,
			},
		})
	}
>
	{#snippet Item({ item: evmSelector })}
		{@const evmSelectorSelector = evmSelector[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmSelector}
			entitySelector={evmSelectorSelector}
			href={
				resolve(
					'/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
					{
						hex: evmSelectorSelector.hex,
					}
				)
			}
		>
			{#snippet Title()}
				{evmSelectorSelector.hex || 'EVM selector'}
			{/snippet}

			{#snippet Value()}
				{evmSelectorSelector.hex}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
