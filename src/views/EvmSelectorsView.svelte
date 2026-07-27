<!-- Generated from APP.ts. Do not edit by hand. -->

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
			],
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
						hex: String(evmSelectorSelector.hex),
					}
				)
			}
		>
			{#snippet Title()}
				EVM selector
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
