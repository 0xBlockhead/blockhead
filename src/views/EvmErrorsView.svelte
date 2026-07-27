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
	}: EntityListViewProps<EntityType.EvmError> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmError}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
			],
		})
	}
>
	{#snippet Item({ item: evmError })}
		{@const evmErrorSelector = evmError[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmError}
			entitySelector={evmErrorSelector}
			href={
				resolve(
					'/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]',
					{
						hex: String(evmErrorSelector.hex),
					}
				)
			}
		>
			{#snippet Title()}
				EVM error
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
